const ImageCapture = () => {
  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optional: Preview the image
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Proceed to the S3 Upload flow we discussed
    const imageKey = await handleFileUpload(file);
    console.log("Image uploaded from camera:", imageKey);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        📸 Take Photo or Upload
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" // This triggers the camera on mobile
          className="hidden" 
          onChange={handleCapture}
        />
      </label>
      {preview && <img src={preview} alt="Food Preview" className="w-32 h-32 object-cover rounded" />}
    </div>
  );
};
