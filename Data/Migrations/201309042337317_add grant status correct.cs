namespace Fundally.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addgrantstatuscorrect : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FundingCycles", "GrantStatusId", c => c.Int(nullable: false, defaultValue: 29));
            AddForeignKey("dbo.FundingCycles", "GrantStatusId", "dbo.Definitions", "Id");
            CreateIndex("dbo.FundingCycles", "GrantStatusId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.FundingCycles", new[] { "GrantStatusId" });
            DropForeignKey("dbo.FundingCycles", "GrantStatusId", "dbo.Definitions");
            DropColumn("dbo.FundingCycles", "GrantStatusId");
        }
    }
}
