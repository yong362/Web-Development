namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class filedownload : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FileResults", "CreatOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.FileResults", "extension", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.FileResults", "extension");
            DropColumn("dbo.FileResults", "CreatOn");
        }
    }
}
