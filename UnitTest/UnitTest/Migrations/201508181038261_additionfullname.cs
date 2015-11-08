namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class additionfullname : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FileResults", "fullName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.FileResults", "fullName");
        }
    }
}
