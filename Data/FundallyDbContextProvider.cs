﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Security;
using Breeze.WebApi;
using Fundally.Domain.Model;
using WebMatrix.WebData;

namespace Fundally.Data
{
    public class FundallyDbContextProvider : EFContextProvider<FundallyDbContext> 
    {
        public FundallyDbContextProvider() : base() { }
 
        protected override bool BeforeSaveEntity(EntityInfo entityInfo) {
            // Add custom logic here in order to save entities
            // Return false if don´t want to  save the entity            
            return true;
       }
 
        protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap) {
            // Add custom logic here in order to save entities
            List<EntityInfo> userprofiles;
            if (saveMap.TryGetValue(typeof(UserProfile), out userprofiles))
            {                
                var errors = userprofiles.Select(oi =>
                {
                    return new EFEntityError(oi, "Save Failed", "Cannot save Users using the Breeze api", "UserProfileId");
                });
                throw new EntityErrorsException(errors);
            }

            //Set the OwnerId of any modified rows
            foreach (var etyType in saveMap.Values)
            {
                foreach (var ety in etyType)
                {
                    AuditableModelBase amb = ety.Entity as AuditableModelBase;
                    if (amb != null)
                    {
                        amb.OwnerId = WebSecurity.CurrentUserId;
                    }
                }
            }
            //saveMap.OfType<AuditableModelBase>().ForEach(amb => amb.OwnerId = WebSecurity.CurrentUserId);

            //List<EntityInfo> articles;
            //if (saveMap.TryGetValue(typeof(Article), out articles))
            //{
            //    if (articles.Any() && !Roles.IsUserInRole("Administrator"))
            //    {
            //        var errors = articles.Select(oi =>
            //        {
            //            return new EFEntityError(oi, "Save Failed", "Only administrators can save articles", "ArticleId");
            //        });
            //        throw new EntityErrorsException(errors);
            //    }
            //}

            //List<EntityInfo> categories;
            //if (saveMap.TryGetValue(typeof(Category), out categories))
            //{
            //    if (categories.Any() && !Roles.IsUserInRole("Administrator"))
            //    {
            //        var errors = categories.Select(oi =>
            //        {
            //            return new EFEntityError(oi, "Save Failed", "Only administrators can save categories", "CategoryId");
            //        });
            //        throw new EntityErrorsException(errors);
            //    }
            //}

            //List<EntityInfo> tags;
            //if (saveMap.TryGetValue(typeof(Tag), out tags))
            //{
            //    if (categories.Any() && !Roles.IsUserInRole("Administrator"))
            //    {
            //        var errors = userprofiles.Select(oi =>
            //        {
            //            return new EFEntityError(oi, "Save Failed", "Only administrators can save tags", "TagId");
            //        });
            //        throw new EntityErrorsException(errors);
            //    }
            //}
            return saveMap;
        }
    }
}
