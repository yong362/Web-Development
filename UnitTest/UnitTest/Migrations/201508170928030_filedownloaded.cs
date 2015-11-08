namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class filedownloaded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FileResults", "savePath", c => c.String());
            DropColumn("dbo.FileResults", "Description");
            DropColumn("dbo.FileResults", "CreatedTimestamp");
            DropColumn("dbo.FileResults", "UpdatedTimestamp");
            DropColumn("dbo.FileResults", "DownloadLink");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FileResults", "DownloadLink", c => c.String());
            AddColumn("dbo.FileResults", "UpdatedTimestamp", c => c.DateTime(nullable: false));
            AddColumn("dbo.FileResults", "CreatedTimestamp", c => c.DateTime(nullable: false));
            AddColumn("dbo.FileResults", "Description", c => c.String());
            DropColumn("dbo.FileResults", "savePath");
        }
    }
}
