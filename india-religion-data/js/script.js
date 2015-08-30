window.PykChartsInit = function (e) {
    var k = new PykCharts.maps.oneLayer({
            selector: "#population_india",
            data: "data/population_total.csv",
            map_code: "india",

            // optional
            chart_height: 580,
            default_zoom_level: 100,
            credit_my_site_name: "YD",
            credit_my_site_url:  "http://khaostokosmos.tumblr.com",
            data_source_name: "Census of India",
            data_source_url: "http://censusindia.gov.in/",
            chart_onhover_effect: "color_saturation",
            title_text: "Population across States",
            title_color: "black",
            title_size: 2,
            title_weight: "normal",
            title_family: "Garamond",
            color_mode: "saturation"
            // subtitle_text: "Comparison of growing economies in Asia",
            // subtitle_color: "gray",
            // subtitle_size: 2,
            // subtitle_weight: "normal",
            // subtitle_family: "Arial"
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#gender_india",
            data: "data/population_gender.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 300,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rural_india",
            data: "data/population_rural.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 300,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#hindu_population",
            data: "data/hindu_population.csv",

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#muslim_population",
            data: "data/muslim_population.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#christian_population",
            data: "data/christian_population.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#sikh_population",
            data: "data/sikh_population.csv",

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#buddhist_population",
            data: "data/buddhist_population.csv",

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#jain_population",
            data: "data/jain_population.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#otherReligion_population",
            data: "data/otherReligion_population.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#noReligion_population",
            data: "data/noReligion_population.csv",

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#male_religion",
            data: "data/male_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Males",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#female_religion",
            data: "data/female_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Females",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.bubble({
            selector: "#religion_overview",
            data: "data/total_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#urban_religion",
            data: "data/urban_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Urban",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_religion",
            data: "data/rural_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Rural",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.multiD.pulse({
            selector: "#religion_pulse",
            data: "data/religion_pulse.csv",

            // optional
            // chart_margin_left: 100,
            // chart_margin_right: 5,
            // chart_margin_top: 5,
            chart_width: 1500,
            axis_x_pointer_color: "white",
            axis_y_pointer_color: "white",
            legends_enable: "no",
            variable_circle_size_enable : "yes",
            chart_color: ["#990000","#d7301f","#ef6548","#fc8d59","#fdbb84","#fdd49e","#fee8c8","#fff7ec"],
            background_color: "rgba(0, 0, 0, 0.8)"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_hindu",
            data: "data/gender_hindu.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender-Hindu",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_muslim",
            data: "data/gender_muslim.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Muslim",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_christian",
            data: "data/gender_christian.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Christian",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_sikh",
            data: "data/gender_sikh.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Sikh",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_buddhist",
            data: "data/gender_buddhist.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Buddhist",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_jain",
            data: "data/gender_jain.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Jain",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_noReligion",
            data: "data/gender_noReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender-Religion Unstated",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_otherReligion",
            data: "data/gender_otherReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Other Religions",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_hindu",
            data: "data/rururb_hindu.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Hindu",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_hindu",
            data: "data/rural_hindu.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Hindu (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_hindu",
            data: "data/urban_hindu.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Hindu (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_muslim",
            data: "data/rururb_muslim.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Muslim",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_muslim",
            data: "data/rural_muslim.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Muslim (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_muslim",
            data: "data/urban_muslim.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Muslim (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_christian",
            data: "data/rururb_christian.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Christian",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_christian",
            data: "data/rural_christian.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Christian (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_christian",
            data: "data/urban_christian.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Christian (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_sikh",
            data: "data/rururb_sikh.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Sikh",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_sikh",
            data: "data/rural_sikh.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Sikh (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_sikh",
            data: "data/urban_sikh.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Sikh (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_buddhist",
            data: "data/rururb_buddhist.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Buddhist",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_buddhist",
            data: "data/rural_buddhist.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Buddhist (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_buddhist",
            data: "data/urban_buddhist.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Buddhist (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_jain",
            data: "data/rururb_jain.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Jain",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_jain",
            data: "data/rural_jain.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Jain (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_jain",
            data: "data/urban_jain.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Jain (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_otherReligion",
            data: "data/rururb_otherReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Other Religions",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_otherReligion",
            data: "data/rural_otherReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Other Religions (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_otherReligion",
            data: "data/urban_otherReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Other Religions (Urban)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rururb_noReligion",
            data: "data/rururb_noReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Rural/Urban - Religion Unstated",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#rural_noReligion",
            data: "data/rural_noReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Religion Unstated (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_noReligion",
            data: "data/urban_noReligion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60,
            title_text: "Gender - Religion Unstated (Urban)",
            title_size: 1
      });
      k.execute();
}
