namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finialisev5 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results");
            DropForeignKey("dbo.resultUnits", "resultID", "dbo.results");
            DropIndex("dbo.resultGlobalUnits", new[] { "resultID" });
            DropIndex("dbo.resultUnits", new[] { "resultID" });
        }
        
        public override void Down()
        {
            CreateIndex("dbo.resultUnits", "resultID");
            CreateIndex("dbo.resultGlobalUnits", "resultID");
            AddForeignKey("dbo.resultUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
            AddForeignKey("dbo.resultGlobalUnits", "resultID", "dbo.results", "resultID", cascadeDelete: true);
        }
    }
}
