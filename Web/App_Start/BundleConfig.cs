using System;
using System.Web.Optimization;

namespace Fundally.Web {
  public class BundleConfig {
	public static void RegisterBundles(BundleCollection bundles) {
	  bundles.IgnoreList.Clear();
	  AddDefaultIgnorePatterns(bundles.IgnoreList);

	  bundles.Add(
		new ScriptBundle("~/scripts/vendor")
		  .Include("~/Scripts/jquery-{version}.js")
		  .Include("~/Scripts/knockout-{version}.js")
		  .Include("~/Scripts/knockout.validation.js") 
          //.Include("~/Scripts/app/knockout-fundally-extenders.js")
		  .Include("~/Scripts/sammy-{version}.js")
		  .Include("~/Scripts/bootstrap.js")
		  .Include("~/Scripts/toastr.js")
		  .Include("~/Scripts/jquery.hammer.min.js")
		  .Include("~/Scripts/Stashy.js")
		  .Include("~/Scripts/Q.js")
		  .Include("~/Scripts/breeze.js")
          .Include("~/Scripts/moment.js")
          .Include("~/Scripts/moment-datepicker.js")
          .Include("~/Scripts/moment-datepicker-ko.js")
		  .Include("~/Scripts/jqPlot/jquery.jqplot.js")
		  .Include("~/Scripts/jqPlot/jqplot.dateAxisRenderer.js")
		);

	  bundles.Add(
		new StyleBundle("~/Content/css")
		  .Include("~/Content/ie10mobile.css")
		  .Include("~/Content/bootstrap.css")
		  .Include("~/Content/font-awesome.css")
		  .Include("~/Content/durandal.css")
		  .Include("~/Content/toastr.css")
		  .Include("~/Content/Stashy.css")
          .Include("~/Content/datepicker.css")
		  .Include("~/Content/fundally-bootstrap.css")
		  .Include("~/Content/fundally.css")
		  .Include("~/Content/jquery.jqplot.css")
		);

	  bundles.Add(
		new StyleBundle("~/Content/custom")
		  .Include("~/Content/app.css")
		);
	}

	public static void AddDefaultIgnorePatterns(IgnoreList ignoreList) {
	  if(ignoreList == null) {
		throw new ArgumentNullException("ignoreList");
	  }

	  ignoreList.Ignore("*.intellisense.js");
	  ignoreList.Ignore("*-vsdoc.js");
	  ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
	}
  }
}