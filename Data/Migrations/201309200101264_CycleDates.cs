namespace Fundally.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CycleDates : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FundingCycleDates",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DateTypeId = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false),
                        Notes = c.String(),
                        FundingCycleId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Definitions", t => t.DateTypeId)
                .ForeignKey("dbo.FundingCycles", t => t.FundingCycleId)
                .Index(t => t.DateTypeId)
                .Index(t => t.FundingCycleId);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.FundingCycleDates", new[] { "FundingCycleId" });
            DropIndex("dbo.FundingCycleDates", new[] { "DateTypeId" });
            DropForeignKey("dbo.FundingCycleDates", "FundingCycleId", "dbo.FundingCycles");
            DropForeignKey("dbo.FundingCycleDates", "DateTypeId", "dbo.Definitions");
            DropTable("dbo.FundingCycleDates");
        }
    }
}
