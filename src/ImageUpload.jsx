import { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleGenerateResponse = async() => {
    // Validation: Check if both image and prompt exist
    if (!selectedImage) {
      alert('Please select an image first!');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData to properly send file
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('prompt', prompt);

      console.log('Sending data:');
      console.log('Image file:', selectedImage);
      console.log('Prompt:', prompt);

      const response = await axios.post('http://116.202.210.102:8001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response received:', response.data);
      
      // Store the response directly from POST
      setResponseData(response.data);
      
    } catch (error) {
      console.error('Error generating response:', error);
      console.error('Error details:', error.response?.data || error.message);
      setResponseData({ error: 'Failed to generate response' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Image Upload & Preview
      </h1>
      
      <div className="flex gap-8">
        <div className="w-96 bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <label 
              htmlFor="imageInput" 
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg 
                  className="w-8 h-8 mb-3 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input 
                id="imageInput" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Upload Button */}
          <div className="mb-6">
            <button
              onClick={() => document.getElementById('imageInput').click()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Choose Image
            </button>
          </div>
        </div>

        {/* Middle - Image Preview */}
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-96 h-96 object-contain rounded-lg shadow-xl border border-gray-200"
          />
        ) : (
          <div className="w-96 h-96 bg-white rounded-lg shadow-xl border-2 border-gray-300 border-dashed flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg 
                className="w-12 h-12 mx-auto mb-2 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-sm font-medium">Preview will appear here</p>
            </div>
          </div>
        )}

        {/* Right Side - Prompt Section */}
        <div className="w-150 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate Response</h3>
          
          {/* Prompt Input */}
          <div className="mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="write your prompt here"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleGenerateResponse}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Generating...' : 'Generate Response'}
          </button>
        </div>
      </div>

      {/* Response Display Section */}
      {responseData && (
        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Response</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            {responseData.error ? (
              <div className="text-red-600 font-medium">
                Error: {responseData.error}
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed">
                {(() => {
                  let content = '';
                  
                  // Handle different response formats
                  if (typeof responseData === 'string') {
                    content = responseData;
                  } else if (responseData.image_description) {
                    content = responseData.image_description;
                  } else if (responseData.message) {
                    content = responseData.message;
                  } else if (responseData.response) {
                    content = responseData.response;
                  } else if (responseData.text) {
                    content = responseData.text;
                  } else if (responseData.result) {
                    content = responseData.result;
                  } else if (responseData.data) {
                    content = typeof responseData.data === 'string' ? responseData.data : responseData.data.message || responseData.data.text || 'Response received';
                  } else if (typeof responseData === 'object') {
                    content = Object.entries(responseData)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join('\n');
                  } else {
                    content = 'Response received successfully';
                  }
                  
                  // Format the content for better readability
                  return content.split('\n').map((line, index) => {
                    // Handle table rows (lines with |)
                    if (line.includes('|')) {
                      return (
                        <div key={index} className="font-mono text-sm bg-white p-2 border-l-2 border-blue-300 mb-1">
                          {line}
                        </div>
                      );
                    }
                    
                    // Handle headers (lines starting with -)
                    if (line.trim().startsWith('-')) {
                      return (
                        <div key={index} className="font-semibold text-blue-800 mt-2 mb-1">
                          {line.replace(/^-\s*/, '• ')}
                        </div>
                      );
                    }
                    
                    // Handle regular lines
                    if (line.trim()) {
                      return (
                        <div key={index} className="mb-1">
                          {line}
                        </div>
                      );
                    }
                    
                    // Empty lines for spacing
                    return <div key={index} className="mb-2"></div>;
                  });
                })()}
              </div>
            )}
          </div>

          {/* Clear Response Button */}
          <button
            onClick={() => setResponseData(null)}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Clear Response
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 