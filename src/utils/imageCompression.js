/**
 * Compresses an image file using the Canvas API.
 * 
 * @param {File} file - The image file object to compress.
 * @param {number} maxWidth - The maximum width for the compressed image (default: 1200px).
 * @param {number} quality - The quality of the JPEG output (0 to 1, default: 0.7).
 * @returns {Promise<string>} - A promise that resolves to the compressed base64 data URL.
 */
export const compressImage = async (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if width is greater than maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Export as compressed JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(new Error('Failed to load image for compression'));
        };
        reader.onerror = (error) => reject(new Error('Failed to read file'));
    });
};
