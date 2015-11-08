using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace UnitTest.Models.Storage
{
    public static class AzureBlobStorage
    {
        private static CloudStorageAccount account;
        private static CloudBlobClient client;
        private static readonly string containerName = "ystestfiles";

        static AzureBlobStorage()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["STORAGE"].ConnectionString;
            account = CloudStorageAccount.Parse(connectionString);
            client = account.CreateCloudBlobClient();
        }

        public static CloudBlobContainer GetContainer()
        {
            CloudBlobContainer container = client.GetContainerReference(containerName);
            container.CreateIfNotExists(BlobContainerPublicAccessType.Blob);
            return container;
        }

        public static string UploadHttpPostedFile(HttpPostedFileBase httpPostedFile, string path)
        {
            string blobname = path.ToLower();
            CloudBlockBlob blockBlob = GetContainer().GetBlockBlobReference(blobname);
            blockBlob.Properties.ContentType = httpPostedFile.ContentType;
            blockBlob.UploadFromStream(httpPostedFile.InputStream);
            return account.BlobEndpoint.AbsoluteUri + containerName + "/" + blobname;
        }

        public static string UploadHttpPostedFile(HttpPostedFile httpPostedFile, string path)
        {
            return UploadHttpPostedFile(new HttpPostedFileWrapper(httpPostedFile), path);
        }

        public static Tuple<Stream, string> GetFileBlocking(string path)
        {
            var blob = GetContainer().GetBlockBlobReference(path);
            //blob.FetchAttributes();
            var contentType = "???"; // blob.Properties.ContentType;
            var stream = blob.OpenRead();
            return new Tuple<Stream, string>(stream, contentType);
        }

        public static async Task MoveFile( string fromFilename,  string toFilename)
        {
            var from = GetContainer().GetBlockBlobReference(fromFilename);
            var to = GetContainer().GetBlockBlobReference(toFilename);
            await to.StartCopyFromBlobAsync(from);
            while (to.CopyState.Status == CopyStatus.Pending)
                await Task.Delay(100);
            if (to.CopyState.Status == CopyStatus.Success)
            {
                await from.DeleteAsync();
            }
            else
            {
                throw new ApplicationException("Sever internal error");
            }
        }

        public static async Task<bool> DeleteFile(string blobName)
        {
            return await GetContainer().GetBlockBlobReference(blobName).DeleteIfExistsAsync();
        }
    }
}