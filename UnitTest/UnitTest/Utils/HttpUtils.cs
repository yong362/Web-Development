using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Web;

namespace UnitTest.Utils
{
    public static class HttpUtils
    {
        public static List<TEntity> RunPaginatedQuery2<TEntity, TSortKey, DB>(DB db, Expression<Func<TEntity, bool>> filter,
           Expression<Func<TEntity, TSortKey>> sort, int offset = 0, int limit = 100)
            where TEntity : class
            where DB : DbContext
        {
            return (from s in db.Set<TEntity>() select s)
                .Where(filter)
                .OrderByDescending(sort)
                .Skip(offset)
                .Take(limit)
                .ToList();
        }

        public static List<TEntity> RunPaginatedQuery<TEntity, TSortKey, DB>(DB db, IQueryable<TEntity> query,
            int offset = 0, int limit = 100)
            where TEntity : class
            where DB : DbContext
        {
            return query
                .Skip(offset)
                .Take(limit)
                .ToList();
        }
    }

    public static class RequestParamUtils
    {
        public static readonly IDictionary<string, string> defaultArgs =
            new Dictionary<string, string>()
           {
               { "offset", 0.ToString() },
               { "limit", 1000.ToString() }
           };

        public static IDictionary<string, string> GetRequestArgs(this HttpRequestMessage request)
        {
            return request.GetQueryNameValuePairs().ToDictionary(e => e.Key, e => e.Value);
        }

        public static IDictionary<string, string> GetRequestAndDefaultArgs(this HttpRequestMessage request)
        {
            var requestArgs = request.GetRequestArgs();
            var allArgs = requestArgs.Concat(defaultArgs)
                .GroupBy(d => d.Key)
                .ToDictionary(d => d.Key, d => d.First().Value);
            return allArgs;
        }

        public static ApiResponse<IDictionary<string, string>, IEnumerable<T>> CreateApiResponse<T>(
            this HttpRequestMessage request, IEnumerable<T> results, int total)
        {
            return new ApiResponse<IDictionary<string, string>, IEnumerable<T>>()
            {
                Params = request.GetRequestAndDefaultArgs(),
                Results = results,
                Total = total
            };
        }

        public static T GetQueryArgOrDefault<T>(this HttpRequestMessage request, string name)
        {
            string rawResult;
            if (request.GetRequestAndDefaultArgs().TryGetValue(name, out rawResult))
            {
                T result;
                try
                {
                    result = (T)Convert.ChangeType(rawResult, typeof(T));
                }
                catch (Exception)
                {
                    result = default(T);
                }
                return result;
            }
            else
            {
                return default(T);
            }
        }
        public static int ResultOffset(this HttpRequestMessage request)
        {
            return request.GetQueryArgOrDefault<int>("offset");
        }

        public static int ResultLimit(this HttpRequestMessage request)
        {
            int limit = request.GetQueryArgOrDefault<int>("limit");
            return limit == 0 ? 100 : limit;
        }
    }

    public class ApiResponse<TParams, TResults>
    {

        public TParams Params { get; set; }

        public int Total { get; set; }

        public TResults Results { get; set; }
    }
}