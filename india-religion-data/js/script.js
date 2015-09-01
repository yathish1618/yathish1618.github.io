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
            color_mode: "saturation",
            palette_color : "Orange-1",
            // subtitle_text: "Comparison of growing economies in Asia",
            // subtitle_color: "gray",
            // subtitle_size: 2,
            // subtitle_weight: "normal",
            // subtitle_family: "Arial"
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#gender_india",
            data: 'name,weight\nMale,623270258\nFemale,587584719',

            // optional,
            color_mode: "shade",
            shade_color: "aqua",
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#rural_india",
            data: 'name,weight\nRural,833748852\nUrban,377106125',

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            donut_radius_percent: 100,
            donut_inner_radius_percent: 60
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#hindu_population",
            data: 'name,weight\nHindu,966257353\nOthers,244597624',

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#muslim_population",
            data: 'name,weight\nMuslim,172245158\nOthers,1038609819',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            label_color:"black"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#christian_population",
            data: 'name,weight\nChristian,27819588\nOthers,1183035389',

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#sikh_population",
            data: 'name,weight\nSikh,20833116\nOthers,1190021861',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#buddhist_population",
            data: 'name,weight\nBuddhist,8442972\nOthers,1202412005',

            // optional
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#jain_population",
            data: 'name,weight\nJain,4451753\nOthers,1206403224',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            label_color:"black"
      });
      k.execute();
    var k = new PykCharts.oneD.donut({
            selector: "#otherReligion_population",
            data: 'name,weight\nOther religions,7937734\nOthers,1202917243',

            // optional
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.pie({
            selector: "#noReligion_population",
            data: 'name,weight\nReligion not stated,2867303\nOthers,1207987674',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            chart_width: 250,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#male_religion",
            data: "data/male_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 220,
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
            chart_width: 220,
            pointer_color: "white",
            title_text: "Females",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.bubble({
            selector: "#religion_overview",
            data: "data/total_religion.csv",

            // optional
            color_mode: "shade",
            shade_color: "#FF9933",
            donut_show_total_at_center: "no",
            chart_width: 220,
            pointer_color: "white"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#urban_religion",
            data: "data/urban_religion.csv",

            // optional
            donut_show_total_at_center: "no",
            chart_width: 220,
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
            chart_width: 220,
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
            chart_color: ["#990000","#d7301f","#ef6548","#fc8d59","yellow","#fdd49e","#fee8c8","#fff7ec"],
            background_color: "rgba(0, 0, 0, 0.8)"
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_hindu",
            data: 'name,weight\nMales,498306968\nFemales,467950385',

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
            data: 'name,weight\nMales,88273945\nFemales,83971213',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Muslim",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_christian",
            data: 'name,weight\nMales,13751031\nFemales,14068557',

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
            data: 'name,weight\nMales,10948431\nFemales,9884685',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Sikh",
            title_size: 1,
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_buddhist",
            data: 'name,weight\nMales,4296010\nFemales,4146962',

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
            data: 'name,weight\nMales,2278097\nFemales,2173656',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender- Jain",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_noReligion",
            data: 'name,weight\nMales,1463712\nFemales,1403591',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender-Religion Unstated",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionDonut({
            selector: "#gender_otherReligion",
            data: 'name,weight\nMales,3952064\nFemales,3985670',

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
            data: 'name,weight\nRural,684093951\nUrban,282163402',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nMales,351423647\nFemales,332670304',

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
            data: 'name,weight\nMales,146883321\nFemales,135280081',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nRural,103504739\nUrban,68740419',

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
            data: 'name,weight\nMales,52870001\nFemales,50634738',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Muslim (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_muslim",
            data: 'name,weight\nMales,35403944\nFemales,33336475',

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
            data: 'name,weight\nRural,16657065\nUrban,11162523',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nMales,8295745\nFemales,8361320',

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
            data: 'name,weight\nMales,5455286\nFemales,5707237',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nRural,14930792\nUrban,5902324',

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
            data: 'name,weight\nMales,8295745\nFemales,8361320',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Sikh (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_sikh",
            data: 'name,weight\nMales,3109383\nFemales,2792941',

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
            data: 'name,weight\nRural,4814849\nUrban,3628123',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nMales,2457022\nFemales,2357827',

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
            data: 'name,weight\nMales,1838988\nFemales,1789135',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nRural,904809\nUrban,3546944',

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
            data: 'name,weight\nMales,467577\nFemales,437232',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Jain (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_jain",
            data: 'name,weight\nMales,1810520\nFemales,1736424',

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
            data: 'name,weight\nRural,1643640\nUrban,738727',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nMales,844124\nFemales,799516',

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
            data: 'name,weight\nMales,368170\nFemales,370557',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
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
            data: 'name,weight\nRural,1643640\nUrban,1223663',

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
            data: 'name,weight\nMales,844124\nFemales,799516',

            // optional
            color_mode: "shade",
            shade_color: "#7FFF00",
            label_color:"black",
            donut_show_total_at_center: "no",
            chart_width: 250,
            pointer_color: "white",
            title_text: "Gender - Religion Unstated (Rural)",
            title_size: 1
      });
      k.execute();
    var k = new PykCharts.oneD.electionPie({
            selector: "#urban_noReligion",
            data: 'name,weight\nMales,619588\nFemales,604075',

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
