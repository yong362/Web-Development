namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finialisev1 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.resultGlobalUnits", "resultID");
            CreateIndex("dbo.resultStresses", "resultID");
            CreateIndex("dbo.resultUnits", "resultID");
            AddForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
            AddForeignKey("dbo.resultStresses", "resultID", "dbo.results", "resultID", cascadeDelete: true);
            AddForeignKey("dbo.resultUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.resultUnits", "resultID", "dbo.results");
            DropForeignKey("dbo.resultStresses", "resultID", "dbo.results");
            DropForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results");
            DropIndex("dbo.resultUnits", new[] { "resultID" });
            DropIndex("dbo.resultStresses", new[] { "resultID" });
            DropIndex("dbo.resultGlobalUnits", new[] { "resultID" });
        }
    }
}
