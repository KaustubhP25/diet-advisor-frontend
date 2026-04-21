import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Configure using environment variables set in Vercel
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    }
  }
});

const DietAdvisor = () => {
  const { signOut, user } = useAuthenticator((context) => [context.user]);
  const [formData, setFormData] = useState({ food: '', age: '', weight: '', goal: 'maintain' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Get Presigned URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-url`, {
        method: 'POST',
        body: JSON.stringify({ fileName: file.name })
      });
      const { uploadUrl, imageKey } = await res.json();

      // 2. Upload to S3
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

      // 3. Send to API Gateway (DynamoDB/Bedrock)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: 'POST',
        body: JSON.stringify({ ...formData, imageKey, userId: user.username })
      });
      alert("Analysis started!");
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Fitness Tracker</h1>
        <button onClick={signOut} className="text-red-500 text-sm">Sign Out</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea 
          placeholder="What did you eat?" 
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, food: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Age" className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, age: e.target.value})}/>
          <input type="number" placeholder="Weight (kg)" className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, weight: e.target.value})}/>
        </div>
        
        <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg text-center">
          <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"/>
          {preview && <img src={preview} className="mt-4 h-32 mx-auto rounded-lg" alt="preview" />}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          {loading ? "Processing..." : "Analyze Meal"}
        </button>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <Authenticator>
      <DietAdvisor />
    </Authenticator>
  );
}
