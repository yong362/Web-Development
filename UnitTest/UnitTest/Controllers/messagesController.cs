using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using UnitTest.Models;
using UnitTest.Utils;

namespace UnitTest.Controllers
{
    #region Message Controller
    [RoutePrefix("api/1/message")]
    public class messagesController : ApiController
    {
        private TestDBContext db = new TestDBContext();
        [Route("")]
        [HttpGet]
        public ApiResponse<IDictionary<String, String>, IEnumerable<message>> Getmessages()
        {
            int offset = Request.ResultOffset();
            int limit = Request.ResultLimit();
            // var results2 = HttpUtils.RunPaginatedQuery<results, int, TestDBContext>(db,
            // r => true, r => r.resultID, offset, limit);

            var message = db.message.OrderByDescending(r => r.msgID).Skip(offset).Take(limit).ToList();
            //var results = db.results.ToList().OrderByDescending(x => x.resultID);
            var response = Request.CreateApiResponse(message, message.Count());
            return response;
        }
        [Route("")]
        //GET ?id
        [ResponseType(typeof(message))]
        public IHttpActionResult Getmessage(int msgID)
        {
            var message = db.message.Where(msg => msg.msgID == msgID).ToList().OrderByDescending(x => x.resultID);
            if (message.Count() == 0)
            {
                return NotFound();
            }

            return Ok(message);
        }
        [Route("")]
        [HttpGet]
        public ApiResponse<IDictionary<string, string>, IEnumerable<message>> GetresultsPage(string name)
        {
            int offset = Request.ResultOffset();
            int limit = Request.ResultLimit();
            var results = db.message.Where(result => result.name.Contains(name))
                 .OrderByDescending(r => r.resultID)
                 .Skip(offset).Take(limit)
                 .ToList();
            var response = Request.CreateApiResponse(results, results.Count());
            if (name == null)
            {
                var message = db.message.OrderByDescending(r => r.msgID)
                    .Skip(offset)
                    .Take(limit)
                    .ToList();
                response = Request.CreateApiResponse(message, message.Count());
            }




            return response;
        }
        /* [Route ("")]
         [HttpGet]
         public HttpResponseMessage GetSelectedMessage(string name, int catID = 0)
         {
            
             var message = db.message.Where(result => result.name.Contains(name) &&
                 (catID == 0 || result.catID == catID)).ToList();
             if (message.Count() == 0)
             {
                 return Request.CreateResponse(HttpStatusCode.NotFound);
             }
             else
                 return Request.CreateResponse(message);
         }*/
        [Route("")]
        // PUT
        [ResponseType(typeof(void))]
        public IHttpActionResult Putmessage(int id, message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != message.msgID)
            {
                return BadRequest();
            }

            db.Entry(message).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!messageExists(id))
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
        [Route("", Name = "post")]
        // POST: api/messages
        [ResponseType(typeof(message))]
        public IHttpActionResult Postmessage(message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (message.catID == 1)
            {
                return BadRequest(ModelState);
            }
            db.message.Add(message);
            db.SaveChanges();

            return CreatedAtRoute("post", new { id = message.msgID }, message);
        }
        [Route("")]
        // DELETE: api/messages/5
        [ResponseType(typeof(message))]
        public IHttpActionResult Deletemessage(int msgID)
        {
            message message = db.message.Find(msgID);
            if (message == null)
            {
                return NotFound();
            }

            db.message.Remove(message);
            db.SaveChanges();

            return Ok("The item has been Deleted");
        }
        [Route("all")]
        [ResponseType(typeof(message))]
        public IHttpActionResult DeleteAllMessage(String name)
        {
            if (name != null)
            {
                var query = (from r in db.message
                             where r.name.Contains(name)
                             select r);
                db.message.RemoveRange(query);
                db.SaveChanges();
            }
            if (name == null)
            {
                var items = db.message.ToList();
                foreach (var item in items)
                {
                    db.message.Remove(item);
                    db.SaveChanges();
                }
            }
            return Ok("Message has been deleted");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool messageExists(int id)
        {
            return db.message.Count(e => e.msgID == id) > 0;
        }
    }
    #endregion
    #region Category API
    [RoutePrefix("api/1/category")]
    public class categoriesController : ApiController
    {
        private TestDBContext db = new TestDBContext();
        [Route("")]
        //GET
        public List<category> Getcategory()
        {
            var category = db.category.ToList();
            return category;

        }
        [Route("")]
        //GET ?id
        [ResponseType(typeof(category))]
        public IHttpActionResult Getcategory(int catID)
        {
            category category = db.category.Find(catID);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
    }
    #endregion
}