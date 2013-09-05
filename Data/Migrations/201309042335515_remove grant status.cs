namespace Fundally.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removegrantstatus : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.FundingCycles", "GranStatus_Id", "dbo.Definitions");
            DropIndex("dbo.FundingCycles", new[] { "GranStatus_Id" });
            DropColumn("dbo.FundingCycles", "GrantStatusId");
            DropColumn("dbo.FundingCycles", "GranStatus_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FundingCycles", "GranStatus_Id", c => c.Int());
            AddColumn("dbo.FundingCycles", "GrantStatusId", c => c.Int(nullable: false));
            CreateIndex("dbo.FundingCycles", "GranStatus_Id");
            AddForeignKey("dbo.FundingCycles", "GranStatus_Id", "dbo.Definitions", "Id");
        }
    }
}
