const cloudinaryImageUploadMethod = async (file: File) => {
  const fileFormData = new FormData();
  fileFormData.append("file", file);
  fileFormData.append("upload_preset", "magictouch");
  fileFormData.append("api_key", "576362483996259");

  const data = await fetch(
    "https://api.cloudinary.com/v1_1/dwyiumj4j/auto/upload",
    {
      method: "POST",
      body: fileFormData,
    }
  )
    .then((res) => res.json())
    .catch((error) => error);
  return data;
};

export default cloudinaryImageUploadMethod;
