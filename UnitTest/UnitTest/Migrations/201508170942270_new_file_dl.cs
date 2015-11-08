namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class new_file_dl : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FileResults", "FileNames", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.FileResults", "FileNames");
        }
    }
}
