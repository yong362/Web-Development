namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class filedl : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FileResults",
                c => new
                    {
                        fileID = c.Int(nullable: false, identity: true),
                        Description = c.String(),
                        CreatedTimestamp = c.DateTime(nullable: false),
                        UpdatedTimestamp = c.DateTime(nullable: false),
                        DownloadLink = c.String(),
                    })
                .PrimaryKey(t => t.fileID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FileResults");
        }
    }
}
