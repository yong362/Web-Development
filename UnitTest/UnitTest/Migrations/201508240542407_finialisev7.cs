namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finialisev7 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.resultGlobalUnits", "resultID");
            CreateIndex("dbo.resultUnits", "resultID");
            AddForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
            AddForeignKey("dbo.resultUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.resultUnits", "resultID", "dbo.results");
            DropForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results");
            DropIndex("dbo.resultUnits", new[] { "resultID" });
            DropIndex("dbo.resultGlobalUnits", new[] { "resultID" });
        }
    }
}
