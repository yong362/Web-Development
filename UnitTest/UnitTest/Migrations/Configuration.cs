namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using UnitTest.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<UnitTest.Models.TestDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(UnitTest.Models.TestDBContext context)
        {
            context.category.AddOrUpdate(i => i.catID,
              new category
              {
                  name = "All Category"
              },
              new category
              {
                  name = "Update"
              },
              new category
              {
                  name = "Alert"
              },
              new category
              {
                  name = "Remarks"
              }
           );
            context.message.AddOrUpdate(i => i.msgID,
                  new message
                  {
                      name = "CJ",
                      content = "Updated Flex api",
                      createOn = DateTime.Now,
                      catID = 2
                  },
                  new message
                  {
                      name = "JC",
                      content = "Error fix for Auth API",
                      createOn = DateTime.Now,
                      catID = 3
                  },
                  new message
                  {
                      name = "SJ",
                      content = "JC , please review it",
                      createOn = DateTime.Now,
                      catID = 4
                  });

            context.unitType.AddOrUpdate(i => i.unitTypeID,
               new unitType
               {
                   typeName = "Authentication",
               },
                 new unitType
                 {
                     typeName = "Flex",
                 },
                 new unitType
                 {
                     typeName = "Entity",
                 },
                 new unitType
                 {
                     typeName = "Claims",
                 }
           );

        }
    }
}
