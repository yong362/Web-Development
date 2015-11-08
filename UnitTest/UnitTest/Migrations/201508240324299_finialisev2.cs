namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finialisev2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.resultStresses", "resultID", "dbo.results");
            DropIndex("dbo.resultStresses", new[] { "resultID" });
            DropTable("dbo.resultStresses");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.resultStresses",
                c => new
                    {
                        stressID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        contentType = c.String(),
                        data = c.String(),
                        resultID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.stressID);
            
            CreateIndex("dbo.resultStresses", "resultID");
            AddForeignKey("dbo.resultStresses", "resultID", "dbo.results", "resultID", cascadeDelete: true);
        }
    }
}
