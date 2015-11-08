namespace UnitTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.categories",
                c => new
                    {
                        catID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                    })
                .PrimaryKey(t => t.catID);
            
            CreateTable(
                "dbo.messages",
                c => new
                    {
                        msgID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        content = c.String(),
                        createOn = c.DateTime(nullable: false),
                        catID = c.Int(nullable: false),
                        resultID = c.Int(),
                    })
                .PrimaryKey(t => t.msgID)
                .ForeignKey("dbo.categories", t => t.catID, cascadeDelete: true)
                .Index(t => t.catID);
            
            CreateTable(
                "dbo.resultGlobalUnits",
                c => new
                    {
                        unitID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        failures = c.Boolean(nullable: false),
                        reason = c.String(),
                        time = c.DateTime(nullable: false),
                        resultID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.unitID);
            
            CreateTable(
                "dbo.results",
                c => new
                    {
                        resultID = c.Int(nullable: false, identity: true),
                        unitTypeID = c.Int(nullable: false),
                        date = c.DateTime(),
                        testTypeID = c.Int(nullable: false),
                        Upercent = c.Double(nullable: false),
                        Gpercent = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.resultID)
                .ForeignKey("dbo.testTypes", t => t.testTypeID, cascadeDelete: true)
                .ForeignKey("dbo.unitTypes", t => t.unitTypeID, cascadeDelete: true)
                .Index(t => t.unitTypeID)
                .Index(t => t.testTypeID);
            
            CreateTable(
                "dbo.testTypes",
                c => new
                    {
                        testTypeID = c.Int(nullable: false, identity: true),
                        testName = c.String(),
                    })
                .PrimaryKey(t => t.testTypeID);
            
            CreateTable(
                "dbo.unitTypes",
                c => new
                    {
                        unitTypeID = c.Int(nullable: false, identity: true),
                        typeName = c.String(),
                    })
                .PrimaryKey(t => t.unitTypeID);
            
            CreateTable(
                "dbo.resultStresses",
                c => new
                    {
                        stressID = c.Int(nullable: false, identity: true),
                        totalElapsed = c.Double(nullable: false),
                        mean = c.Double(nullable: false),
                        currentRate = c.Double(nullable: false),
                        median = c.Double(nullable: false),
                        p75 = c.Double(nullable: false),
                        p95 = c.Double(nullable: false),
                        p99 = c.Double(nullable: false),
                        p999 = c.Int(nullable: false),
                        resultID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.stressID)
                .ForeignKey("dbo.results", t => t.resultID, cascadeDelete: true)
                .Index(t => t.resultID);
            
            CreateTable(
                "dbo.resultUnits",
                c => new
                    {
                        unitID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        failures = c.Boolean(nullable: false),
                        reason = c.String(),
                        time = c.DateTime(nullable: false),
                        resultID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.unitID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.resultStresses", "resultID", "dbo.results");
            DropForeignKey("dbo.results", "unitTypeID", "dbo.unitTypes");
            DropForeignKey("dbo.results", "testTypeID", "dbo.testTypes");
            DropForeignKey("dbo.messages", "catID", "dbo.categories");
            DropIndex("dbo.resultStresses", new[] { "resultID" });
            DropIndex("dbo.results", new[] { "testTypeID" });
            DropIndex("dbo.results", new[] { "unitTypeID" });
            DropIndex("dbo.messages", new[] { "catID" });
            DropTable("dbo.resultUnits");
            DropTable("dbo.resultStresses");
            DropTable("dbo.unitTypes");
            DropTable("dbo.testTypes");
            DropTable("dbo.results");
            DropTable("dbo.resultGlobalUnits");
            DropTable("dbo.messages");
            DropTable("dbo.categories");
        }
    }
}
