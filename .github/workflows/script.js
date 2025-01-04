// Handle file input change and preview selected file
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.type === "image/heic" || file.type === "image/heif") {
    try {
      const convertedData = await convertHeicToJpeg(file);
      if (convertedData) {
        userData.file = {
          data: convertedData.base64String,
          mime_type: "image/jpeg",
        };
        fileUploadWrapper.querySelector("img").src = `data:image/jpeg;base64,${convertedData.base64String}`;
        fileUploadWrapper.classList.add("file-uploaded");
      } else {
        console.error("Failed to convert HEIC image.");
      }
    } catch (error) {
      console.error("Error during HEIC conversion:", error);
      alert("Failed to convert HEIC image. Please try again.");
    }
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result.split(",")[1];
      fileUploadWrapper.querySelector("img").src = e.target.result;
      fileUploadWrapper.classList.add("file-uploaded");

      userData.file = {
        data: base64String,
        mime_type: file.type,
      };
      fileInput.value = "";
    };
    reader.readAsDataURL(file);
  }
});

// Convert HEIC format to JPEG base64 (uses heic2any library)
async function convertHeicToJpeg(heicFile) {
  try {
    const blob = await heic2any({ blob: heicFile, toType: "image/jpeg" });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ base64String: reader.result.split(",")[1] });
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the converted JPEG data."));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting HEIC image:", error);
    return null;
  }
}
