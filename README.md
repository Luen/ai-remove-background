# AI Background Removal Tool

A modern web application that removes backgrounds from images using AI. Built with Node.js and the Hono framework, leveraging the @imgly/background-removal-node package for high-quality background removal.

## Features

- 🖼️ **Advanced Image Processing**
  - High-quality AI-powered background removal
  - Support for JPEG, PNG, and WebP input formats
  - Automatic conversion to PNG with transparent background
  - Choice of processing models (small, medium, large) for different quality needs

- 🌐 **Modern Web Interface**
  - Drag-and-drop multiple image upload
  - Real-time processing feedback
  - Preview of original and processed images
  - Batch processing support
  - Individual and bulk download options
  - Download as ZIP functionality

- 🚀 **API Features**
  - RESTful API endpoint for removing image backgrounds
  - Comprehensive API documentation
  - Support for multiple image formats
  - Error handling and validation

## Setup

1. Clone the repository:

        ```bash
        git clone https://github.com/yourusername/ai-remove-background.git
        cd ai-remove-background
        ```

2. Install dependencies:

        ```bash
        npm install
        ```

3. Set up your environment variables:

        ```bash
        cp .env.template .env
        ```

4. Edit `.env` file with your configuration:

        ```text
        PORT=3000
        ```

5. Start the server:

        ```bash
        npm start
        ```

For development with auto-reload:

        ```bash
        npm run dev
        ```

## Web Interface Usage

1. Visit the application in your browser (default: `http://localhost:3000`)
2. Upload images by:
   - Dragging and dropping files onto the upload area
   - Clicking "Select Images" to choose files
3. Watch as images are processed in real-time
4. Download options:
   - Download individual images
   - Download all images at once
   - Download all as ZIP file

## API Usage

### Remove Background

**Endpoint:** `POST /api/remove-background`

**Content-Type:** `multipart/form-data`

**Request Body:**

- `image`: The image file to remove background from (JPEG, PNG, or WebP)

**Responses:**

- `200 OK`: Returns the processed image with transparent background as PNG
- `400 Bad Request`: Invalid input or missing image
- `500 Internal Server Error`: Server error

**Example using curl:**

        ```bash
        curl -X POST -F "image=@path/to/your/image.jpg" http://localhost:3000/api/remove-background -o output.png
        ```

### API Documentation

**Endpoint:** `GET /api`

Returns a detailed HTML page documenting the API endpoints and usage.

## Technical Details

- Built with Node.js and Hono framework
- Uses @imgly/background-removal-node for AI processing
- Supports concurrent image processing
- Real-time progress tracking
- Error handling for individual images
- Memory-efficient processing

## Requirements

- Node.js 18 or higher
- Modern web browser with JavaScript enabled
- Sufficient memory for image processing (varies with image size and quantity)

## License

MIT License - feel free to use this in your own projects!
