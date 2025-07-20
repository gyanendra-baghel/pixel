import { getEnv } from "./getEnv.js";

const getGalleryAccessEmail = (gallery) => {
  /**
   * Generates a styled HTML email for users who have been granted access to a gallery
   * @param {Object} gallery - The gallery object containing details
   * @returns {String} - HTML email template
   */
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gallery Access</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #4a6fa5;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 20px;
            background-color: white;
          }
          .gallery-info {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .gallery-info p {
            margin: 8px 0;
          }
          .gallery-info strong {
            color: #4a6fa5;
          }
          .btn-container {
            text-align: center;
            margin: 25px 0;
          }
          .btn {
            display: inline-block;
            background-color: #4a6fa5;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
          }
          .btn:hover {
            background-color: #3a5a80;
          }
          .email-footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .sharing-tips {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0f7ff;
            border-left: 4px solid #4a6fa5;
            border-radius: 4px;
          }
          .sharing-tips h3 {
            margin-top: 0;
            color: #4a6fa5;
          }
          @media only screen and (max-width: 480px) {
            .email-header h1 {
              font-size: 20px;
            }
            .email-body {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Gallery Access Granted</h1>
          </div>
          
          <div class="email-body">
            <p>You've been given access to view the following gallery:</p>
            
            <div class="gallery-info">
              <p><strong>Gallery Name:</strong> ${gallery.name}</p>
              <p><strong>Description:</strong> ${gallery.description || 'No description provided'}</p>
              ${gallery.owner ? `<p><strong>Shared By:</strong> ${gallery.owner}</p>` : ''}
            </div>
            
            <div class="btn-container">
              <a href="${getEnv("FRONTEND_URL")}/gallery/${gallery.id}" class="btn">View Gallery</a>
            </div>
            
            <div class="sharing-tips">
              <h3>Gallery Access Information</h3>
              <p>You can access this gallery at any time using the link below. The gallery owner has granted you permission to view these images.</p>
              <p>Gallery Link: <strong>${getEnv("FRONTEND_URL")}/gallery/${gallery.id}</strong></p>
            </div>
          </div>
          
          <div class="email-footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Gallery App. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export default getGalleryAccessEmail;
