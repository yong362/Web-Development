namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class upload : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.resultStresses", "resultID", "dbo.results");
            DropIndex("dbo.resultStresses", new[] { "resultID" });
            AddColumn("dbo.resultStresses", "name", c => c.String());
            AddColumn("dbo.resultStresses", "contentType", c => c.String());
            AddColumn("dbo.resultStresses", "data", c => c.String());
            DropColumn("dbo.resultStresses", "totalElapsed");
            DropColumn("dbo.resultStresses", "mean");
            DropColumn("dbo.resultStresses", "currentRate");
            DropColumn("dbo.resultStresses", "median");
            DropColumn("dbo.resultStresses", "p75");
            DropColumn("dbo.resultStresses", "p95");
            DropColumn("dbo.resultStresses", "p99");
            DropColumn("dbo.resultStresses", "p999");
        }
        
        public override void Down()
        {
            AddColumn("dbo.resultStresses", "p999", c => c.Int(nullable: false));
            AddColumn("dbo.resultStresses", "p99", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "p95", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "p75", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "median", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "currentRate", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "mean", c => c.Double(nullable: false));
            AddColumn("dbo.resultStresses", "totalElapsed", c => c.Double(nullable: false));
            DropColumn("dbo.resultStresses", "data");
            DropColumn("dbo.resultStresses", "contentType");
            DropColumn("dbo.resultStresses", "name");
            CreateIndex("dbo.resultStresses", "resultID");
            AddForeignKey("dbo.resultStresses", "resultID", "dbo.results", "resultID", cascadeDelete: true);
        }
    }
}
