using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using UnitTest.Models;
using UnitTest.Models.Storage;
using UnitTest.Utils;

namespace UnitTest.Controllers
{
    #region Result Controller
    [RoutePrefix("api/1/results")]
    public class resultsController : ApiController
    {
        private TestDBContext db = new TestDBContext();

        // GET: api/results
        [Route("get")]
        [HttpGet]
        public ApiResponse<IDictionary<string, string>, IEnumerable<results>> GetresultsPage(int unitTypeID)
        {
            int offset = Request.ResultOffset();
            int limit = Request.ResultLimit();
            var results = db.results.Where(result => result.unitTypeID == unitTypeID).OrderByDescending(r => r.resultID).Skip(offset).Take(limit).ToList();
            var response = Request.CreateApiResponse(results, results.Count());
            return response;
        }
        /**[Route("all")]
        [ResponseType(typeof(results))]
        [HttpGet]
        public IHttpActionResult GetAllResult()
        {
            var results = db.results.ToList().OrderByDescending(x => x.resultID);
            if (results.Count() == 0)
            {
                return NotFound();
            }

            return Ok(results);
        }
          **/
        // GET: api/results/5
        [Route("get")]
        [ResponseType(typeof(results))]
        public IHttpActionResult GetresultsID(int resultID)
        {
            var results = db.results.Where(result => result.resultID == resultID).ToList().OrderByDescending(x => x.resultID);
            if (results.Count() == 0)
            {
                return NotFound();
            }

            return Ok(results);
        }
        [Route("edit")]
        // PUT: api/results/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putresults(int id, results results)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != results.resultID)
            {
                return BadRequest();
            }

            db.Entry(results).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!resultsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
        [Route("")]
        //POST:api/results
        [HttpPost]
        public IHttpActionResult Postunit([FromBody] results results)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (results.detailUnit != null)
            {
                var unitType = db.unitType.Where(r =>
               r.unitTypeID == results.unitTypeID)
               .FirstOrDefault();
                //populate detailunit
                int UcountFailures = results.detailUnit.Where(u => u.failures).Count();
                var Upercent = (UcountFailures / (double)results.detailUnit.Count) * 100;
                results.Upercent = Math.Ceiling(Upercent);
                //populate global unit

                int GcountFailures = results.detailglobal.Where(g => g.failures).Count();
                var Gpercent = (GcountFailures / (double)results.detailglobal.Count) * 100;
                results.Gpercent = Math.Ceiling(Gpercent);
                if (double.NaN.Equals(results.Upercent) || double.NaN.Equals(results.Gpercent))
                {
                    return NotFound();
                }
                else
                { // insert into results table
                    db.results.Add(results);
                    db.SaveChanges();
                 
                    var checkresult = db.results.ToList();
                    if (Upercent > 30 && checkresult.Count>4)
                    {
                        var alert = new message { name = "System", content = "Failure rate for " + unitType.typeName + "  is more than 30%, please review it at dashboard tab.", createOn = DateTime.Now, catID = 3, resultID = results.resultID };
                        db.message.Add(alert);
                        db.SaveChanges();
                    }
                }



            }

            return Json(results);
            //return CreatedAtRoute("DefaultApi", new { id = results.resultID }, results);
        }
        [Route("delete")]
        // DELETE: api/result/5
        [ResponseType(typeof(results))]
        public IHttpActionResult DeleteResult(int resultID)
        {

            var Rresults = (from result in db.results
                            where result.resultID == resultID
                            select result);
            db.results.RemoveRange(Rresults);
            db.SaveChanges();
            return Ok("Data has successfully been deleted!");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool resultsExists(int id)
        {
            return db.results.Count(e => e.resultID == id) > 0;
        }
    }
    #endregion
    #region Unit Type Controller
    [RoutePrefix("api/1/typeU")]
    public class unitTypeController : ApiController
    {
        private TestDBContext db = new TestDBContext();
        [Route("get")]
        public List<unitType> Getresults()
        {
            var unitType = db.unitType.ToList();
            return unitType;
        }
        [Route("get")]
        [ResponseType(typeof(unitType))]
        public IHttpActionResult GetunitType(int unitTypeID)
        {
            var unitType = db.unitType.Where(Utype => Utype.unitTypeID == unitTypeID).ToList();
            if (unitType.Count() == 0)
            {
                return NotFound();
            }

            return Ok(unitType);
        }

    }
    #endregion
    #region Unit Controller
    [RoutePrefix("api/1/unit")]
    public class unitController : ApiController
    {
        private TestDBContext db = new TestDBContext();
        [Route("get")]
        public IOrderedEnumerable<resultUnit> Getresults()
        {
            var resultUnit = db.resultUnit.ToList().OrderByDescending(x => x.failures == true);
            return resultUnit;
        }

        [Route("get")]
        [ResponseType(typeof(resultUnit))]
        public IHttpActionResult GetresultUnit(int resultID)
        {
            var thisResult = db.results.Where(r =>
                r.resultID == resultID)
                .FirstOrDefault();
            if (thisResult == null)
                return NotFound();
            var prevResult = db.results.Where(r =>
                r.resultID < resultID &&
                r.unitTypeID == thisResult.unitTypeID)
                .OrderByDescending(r => r.resultID)
                .Take(1)
                .FirstOrDefault();
            if (prevResult == null)
            {
                var lastResults = new int[] { thisResult.resultID };
                var resultUnit = db.resultUnit.Where(unit =>
                lastResults.Contains(unit.resultID))
                .OrderByDescending(x => x.failures == true)
                .ToList();
                return Ok(resultUnit);
            }
            else
            {
                var lastTwoResults = new int[] { thisResult.resultID, prevResult.resultID };
                /*var resultUnits = db.resultUnit.Where(unit =>
                    lastTwoResults.Contains(unit.resultID))
                    .OrderByDescending(x => x.failures == true)
                    .ThenByDescending(x => x.name)
                    .ToList();
            */
                var res = (from ru in db.resultUnit
                           join r in db.results on ru.resultID equals r.resultID
                           where lastTwoResults.Contains(ru.resultID)
                           orderby (ru.failures == true) descending, ru.name descending
                           select new { ru, r.date }).ToList();

                return Ok(res);
            }


        }

        [Route("")]
        [HttpGet]
        [ResponseType(typeof(resultUnit))]
        public HttpResponseMessage GetUnitResult(int resultID)
        {
            var resultUnit = db.resultUnit.Where(unit => unit.resultID == resultID)
                .OrderByDescending(x => x.failures == true)
                .ToList();
            if (resultUnit.Count() == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            else
                return Request.CreateResponse(resultUnit);
        }
    }
    #endregion
    #region Global Controller
    [RoutePrefix("api/1/global")]
    public class globalController : ApiController
    {
        private TestDBContext db = new TestDBContext();
        [Route("get")]
        [ResponseType(typeof(resultGlobalUnit))]
        public IHttpActionResult GetresultUnit(int resultID)
        {
            var global = db.resultGlobalUnit.Where(unit => unit.resultID == resultID).ToList().OrderByDescending(x => x.failures == true);
            if (global.Count() == 0)
            {
                return NotFound();
            }

            return Ok(global);
        }
    }
    #endregion
    #region Download
    [RoutePrefix("api/1/file")]
    public class FileUploadController : ApiController
    {
        Guid guid;
        private TestDBContext db = new TestDBContext();

        [Route("upload")]
        [HttpPost]
        public HttpResponseMessage Upload()
        {
            guid = Guid.NewGuid();
            if (HttpContext.Current.Request.Files.Count < 1)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No files found");

            // Get the uploaded image from the Files collection
            // Set name , extension and create date
            HttpPostedFile postedFile = HttpContext.Current.Request.Files[0];
            var Name = Path.GetFileNameWithoutExtension(postedFile.FileName);
            var extension = Path.GetExtension(postedFile.FileName);
            DateTime fileCreatedDate = DateTime.Now;
            if (extension == null || extension != ".xlsx")
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Incorrect file type, only file with .xlsx type are allowed");
            if (postedFile == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No actual file found");
            // LOCAL STORAGE
            //string tempLocation = this.GetFileUploadTempLocation();
            /* string tempLocation = "C:\\temp";

             if (!Directory.Exists(tempLocation))
                 Directory.CreateDirectory(tempLocation);
             // Get the complete file path
             string fileSavePath = System.IO.Path.Combine(tempLocation, postedFile.FileName);
             // Save the uploaded file to "UploadedFiles" folder
             postedFile.SaveAs(fileSavePath);
             * */
            //END OF LOCAL STORAGE
            //Azure Storage
            string resUrl = AzureBlobStorage.UploadHttpPostedFile(postedFile, (guid + "/" + Name + extension));
            //Saving data into table
            var fileData = new FileResult { FileNames = Name, savePath = resUrl, extension = extension, CreatOn = fileCreatedDate, fullName = postedFile.FileName };
            db.FileResult.Add(fileData);
            db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, "File has been sucessfully uploaded");
        }

        [Route("download")]
        public HttpResponseMessage GetFile(int id)
        {
            var query = db.FileResult.Where(r => r.fileID == id).FirstOrDefault();
            string blobName = query.fullName;
            return Request.CreateResponse(HttpStatusCode.OK, query.savePath);
        }

        [Route("get")]
        [HttpGet]
        public ApiResponse<IDictionary<string, string>, IEnumerable<FileResult>> GetresultsPage()
        {
            int offset = Request.ResultOffset();
            int limit = Request.ResultLimit();
            var results = db.FileResult.OrderByDescending(r => r.fileID).Skip(offset).Take(limit).ToList();
            var response = Request.CreateApiResponse(results, results.Count());
            return response;
        }

        [Route("update")]
        [HttpPost]
        public async Task<HttpResponseMessage> update(int id)
        {
            guid = Guid.NewGuid();
            if (HttpContext.Current.Request.Files.Count < 1)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No files found");

            // Get the uploaded image from the Files collection
            // Set name , extension and create date

            var result = db.FileResult.Where(r => r.fileID == id).FirstOrDefault();
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Update has fail due to internal error."); ;
            }
            HttpPostedFile postedFile = HttpContext.Current.Request.Files[0];
            var Name = Path.GetFileNameWithoutExtension(postedFile.FileName);
            var extension = Path.GetExtension(postedFile.FileName);
            DateTime fileCreatedDate = DateTime.Now;
            if (extension == null || extension != ".xlsx")
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Incorrect file type, only file with .xlsx type are allowed");
            if (postedFile == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No actual file found");
            string newBlobName = guid + "/" + Name + extension;
            string resUrl = AzureBlobStorage.UploadHttpPostedFile(postedFile, (newBlobName));

            // Insert any additional changes to column values.

            // Submit the changes to the database. 
            string originalBlobName = result.savePath.Replace("https://cxatestportal.blob.core.windows.net/ystestfiles/", "");
            await AzureBlobStorage.DeleteFile(originalBlobName);
            try
            {
                db.FileResult.Attach(result);
                result.FileNames = Name;
                result.extension = extension;
                result.fullName = postedFile.FileName;
                result.CreatOn = DateTime.Now;
                result.savePath = resUrl;
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                // Provide for exceptions.
            }
            return Request.CreateResponse(HttpStatusCode.OK, "File has sucessfully updated");
        }
        [Route("delete")]
        [HttpDelete]
        public async Task<HttpResponseMessage> DeleteResult(int id)
        {
            var result = db.FileResult.Where(r => r.fileID == id).FirstOrDefault();
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Fail to delete data due to :1) Data has been deleted  2) Data was not created"); ;
            }
            string originalBlobName = result.savePath.Replace("https://cxatestportal.blob.core.windows.net/ystestfiles/", "");
            await AzureBlobStorage.DeleteFile(originalBlobName);
            db.FileResult.Remove(result);
            db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, "Data has successfully been deleted!");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool resultsExists(int id)
        {
            return db.results.Count(e => e.resultID == id) > 0;
        }
    }

    #endregion
}