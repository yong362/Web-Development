using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace UnitTest.Models
{
    public class unitType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int unitTypeID { get; set; }
        public String typeName { get; set; }
        public List<results> results { get; set; }
    }

    public class results
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int resultID { get; set; }
        public int unitTypeID { get; set; }
        public DateTime? date { get; set; }
        public virtual unitType unitType { get; set; }
        public double Upercent { get; set; }
        public double Gpercent { get; set; }
        public List<resultUnit> detailUnit { get; set; }
        public List<resultGlobalUnit> detailglobal { get; set; }
        // [NotMapped]
        // public virtual List<resultStress> detailStress { get; set; }
        //[NotMapped]
        //public virtual List<resultUnit> detailUnit { get; set; }
        // [NotMapped]
        // public virtual List<resultGlobalUnit> detailglobal { get; set; }
    }

    public class resultUnit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int unitID { get; set; }
        public String name { get; set; }
        public Boolean failures { get; set; }
        public string reason { get; set; }
        public DateTime time { get; set; }
        public int resultID { get; set; }
    }
    public class message
    {
        [Key]
        public int msgID { get; set; }
        public string name { get; set; }
        public string content { get; set; }
        public DateTime createOn { get; set; }
        public int catID { get; set; }
        public int? resultID { get; set; }
    }
    public class category
    {
        [Key]
        public int catID { get; set; }
        public string name { get; set; }
        [JsonIgnore]
        public List<message> message { get; set; }
    }
    public class resultGlobalUnit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int unitID { get; set; }
        public String name { get; set; }
        public Boolean failures { get; set; }
        public string reason { get; set; }
        public DateTime time { get; set; }
        public int resultID { get; set; }

    }
    public class FileResult
    {
        [Key]
        public int fileID { get; set; }
        public string FileNames { get; set; }
        public DateTime CreatOn { get; set; }
        public String extension { get; set; }
        public string savePath { get; set; }
        public string fullName { get; set; }


    }
    public class TestDBContext : DbContext
    {
        public TestDBContext()
            : base("name=DefaultConnection")
        {
        }
        public DbSet<unitType> unitType { get; set; }
        public DbSet<results> results { get; set; }
        public DbSet<resultUnit> resultUnit { get; set; }
        public DbSet<message> message { get; set; }
        public DbSet<category> category { get; set; }
        public DbSet<resultGlobalUnit> resultGlobalUnit { get; set; }
        public DbSet<FileResult> FileResult { get; set; }
    }
}