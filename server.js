import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import fs from 'fs'
import { fileTypeFromBuffer } from 'file-type'
import { removeBackground } from '@imgly/background-removal-node'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// Load environment variables
dotenv.config()

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors())

// Middleware for debugging
app.use('*', async (c, next) => {
    console.log('Request received:', c.req.method, c.req.url)
    console.log('Headers:', JSON.stringify(c.req.header()))

    await next()

    console.log('Response:', c.res.status)
})

// Serve static files
app.use('/', serveStatic({ root: './public' }))

// API documentation route
app.get('/api', (c) => {
    return c.html(fs.readFileSync('public/api.html', 'utf8'))
})

// Create tmp directory if it doesn't exist
if (!fs.existsSync('tmp')) {
    fs.mkdirSync('tmp')
}

// Clean up temporary files periodically (every hour)
setInterval(() => {
    const tmpDir = 'tmp'
    fs.readdir(tmpDir, (err, files) => {
        if (err) return
        files.forEach((file) => {
            const filePath = path.join(tmpDir, file)
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting file ${filePath}:`, err)
            })
        })
    })
}, 3600000)

// Background removal endpoint using Hono's native form parsing
app.post('/api/remove-background', async (c) => {
    try {
        console.log('Received request to /api/remove-background')

        // Parse form data using Hono's built-in functionality
        const formData = await c.req.formData()
        console.log('Form data fields:', [...formData.keys()])

        const file = formData.get('image')

        if (!file || !(file instanceof File)) {
            console.error('No valid image file in request')
            return c.json({ error: 'No image file uploaded' }, 400)
        }

        console.log(
            'Image file found:',
            file.name || 'unnamed',
            file.size || 'unknown size'
        )

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return c.json(
                {
                    error: 'Invalid file type. Only JPEG, PNG and WebP are supported',
                },
                400
            )
        }

        console.log(
            'Processing image:',
            'filename:',
            file.name || 'unnamed',
            'size:',
            file.size,
            'type:',
            file.type
        )

        // Configuration for background removal
        const config = {
            debug: true,
            model: 'medium',
            progress: (key, current, total) => {
                const [type, subtype] = key.split(':')
                console.log(
                    `${type} ${subtype} ${((current / total) * 100).toFixed(
                        0
                    )}%`
                )
            },
            output: {
                quality: 0.8,
                format: 'image/png',
            },
        }

        // Remove background
        const processedBlob = await removeBackground(file, config)
        const processedBuffer = Buffer.from(await processedBlob.arrayBuffer())

        // Save to temporary file
        const outFile = path.join('tmp', `${uuidv4()}.png`)
        await fs.promises.writeFile(outFile, processedBuffer)

        // Set response headers
        c.header('Content-Type', 'image/png')
        c.header(
            'Content-Disposition',
            `attachment; filename="${path.parse(file.name).name}.png"`
        )

        return c.body(processedBuffer)
    } catch (error) {
        console.error('Error processing image:', error)
        return c.json(
            {
                error: 'Failed to process image: ' + error.message,
            },
            500
        )
    }
})

// Start the server
const port = process.env.PORT || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port,
})
