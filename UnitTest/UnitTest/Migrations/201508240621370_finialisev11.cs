namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finialisev11 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.results", "testTypeID", "dbo.testTypes");
            DropIndex("dbo.results", new[] { "testTypeID" });
            DropColumn("dbo.results", "testTypeID");
            DropTable("dbo.testTypes");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.testTypes",
                c => new
                    {
                        testTypeID = c.Int(nullable: false, identity: true),
                        testName = c.String(),
                    })
                .PrimaryKey(t => t.testTypeID);
            
            AddColumn("dbo.results", "testTypeID", c => c.Int(nullable: false));
            CreateIndex("dbo.results", "testTypeID");
            AddForeignKey("dbo.results", "testTypeID", "dbo.testTypes", "testTypeID", cascadeDelete: true);
        }
    }
}
