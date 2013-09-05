namespace Fundally.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FundingCycleAreas : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.FundingAreas", "FundingCycle_Id", "dbo.FundingCycles");
            DropIndex("dbo.FundingAreas", new[] { "FundingCycle_Id" });
            AddColumn("dbo.FundingAreas", "FundingCycleId", c => c.Int());
            AddForeignKey("dbo.FundingAreas", "FundingCycleId", "dbo.FundingCycles", "Id");
            CreateIndex("dbo.FundingAreas", "FundingCycleId");
            DropColumn("dbo.FundingAreas", "FundingCycle_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FundingAreas", "FundingCycle_Id", c => c.Int());
            DropIndex("dbo.FundingAreas", new[] { "FundingCycleId" });
            DropForeignKey("dbo.FundingAreas", "FundingCycleId", "dbo.FundingCycles");
            DropColumn("dbo.FundingAreas", "FundingCycleId");
            CreateIndex("dbo.FundingAreas", "FundingCycle_Id");
            AddForeignKey("dbo.FundingAreas", "FundingCycle_Id", "dbo.FundingCycles", "Id");
        }
    }
}
