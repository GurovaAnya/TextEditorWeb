using System;
using System.IO;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;

namespace TextEditorWeb.Services
{
    public class GoogleStorageService : IDisposable
    {
        private readonly string _bucketName;
        private readonly StorageClient _storageClient;

        public GoogleStorageService()
        {
            this._bucketName = "texteditor-bucket";
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "google-secret.json");
            var credential = GoogleCredential.GetApplicationDefault();
            _storageClient = StorageClient.Create();
        }

        public async Task Write(IFormFile file, string fileName)
        {
            // using (MemoryStream stream = new MemoryStream())
            // {
            //     stream.Write(file, 0, file.Length);
            //     var cloudFile = await _storageClient.UploadObjectAsync(_bucketName, fileName, "text/xml", stream);
            // }
            await _storageClient.UploadObjectAsync(_bucketName, fileName, "text/xml", file.OpenReadStream());

        }      
        
        public async Task Write(String file, string fileName)
        {
            // using (MemoryStream stream = new MemoryStream())
            // {
            //     stream.Write(file, 0, file.Length);
            //     var cloudFile = await _storageClient.UploadObjectAsync(_bucketName, fileName, "text/xml", stream);
            // }
            await _storageClient.UploadObjectAsync(_bucketName, fileName, "text/html", GenerateStreamFromString(file));

        }  
        
        public static Stream GenerateStreamFromString(string s)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(s);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        public async Task<byte []> Read(string fileName)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                await _storageClient.DownloadObjectAsync(_bucketName, fileName, stream);
                return stream.ToArray();
            }
        }
        
        public async Task<string> ReadStr(string fileName)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                await _storageClient.DownloadObjectAsync(_bucketName, fileName, stream);
                return System.Text.Encoding.UTF8.GetString(stream.ToArray());
            }
        }
        

        public async Task Delete(string fileName)
        {
            await _storageClient.DeleteObjectAsync(_bucketName, fileName);
        }

        public void Dispose()
        {
            _storageClient.Dispose();
        }
    }
}