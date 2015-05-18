define(function(require, exports, module) {

    return {
        line:function(data,ele){
            require(['echarts','echarts/chart/line'],function (ec) {

                    var option={
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:data.legend,
                            x:'left',
                            y:20
                        },
                        dataZoom : {
                            show : true,
                            realtime : true,
                            start : 0,
                            end : 100
                        },
                        toolbox: {
                            itemSize:20,
                            y:20,
                            show : true,
                            feature : {
                                saveAsImage : {show: true}
                            }
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : data.footer
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : data.series
                    };
                    var myChart = ec.init($(ele)[0])
                    myChart.setOption(option);
                }
            );
        },
        pie:function(data,ele){
        	var bitch_ = "";
        	if(data.data.length != 0) {
        		bitch_ = data.data[0].bitch;
        	}
        	/*console.log("start");
        	console.log(data.data[0]);
        	console.log(data.data[0].bitch);
        	console.log("end");*/
            require(['echarts','echarts/chart/pie'],function (ec) {

                    var option = {
                        title : {
                            text: data.title,
                            x:'left',
                            y:50,
                            offsetCenter: ['50%', '50%'],
                            textStyle: {
                                color: '#09f',
                                fontSize : 20
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            //formatter: "{a} <br/>{b} : {c} ({d}%)"
                            formatter: function(Array,String,func){
                                console.log(Array)
                                console.log(String)
                                console.log(func)
                                return Array[0]+"<br/>"+Array[1]+" : "+Array[2]+" ("+Array[3]+"%)"+"<br/>"+Array[5].other+"<br/>"+Array[5].asshole;
                            }
                        },
                        toolbox: {
                            show : true,
                            y:50,
                            feature : {
                                saveAsImage : {
                                    show : false,
                                    title : '保存为图片',
                                    type : 'png',
                                    lang : ['点击保存']
                                }
                            }
                        },
                        series : [
                            {
                                name:bitch_,
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:data.data
                            }
                        ]
                    };
                    var myChart = ec.init($(ele)[0])
                    myChart.setOption(option);
                }
            );
        },
        lineCount:function(data,ele){
        	//console.log("start");
        	//console.log(data);
        	//console.log(data.data[0].bitch);
        	//console.log("end");
            require(['echarts','echarts/chart/line'],function (ec) {

                    var option={
                        tooltip : {
                            trigger: 'item',
                            formatter: function(Array,String,func){
                            	//console.log(Array);
                            	//return "日期 : "+Array[5].nonsense+"<br/>活动名称 : "+Array[5].fuckOff+"<br/>"+Array[0]+" : "+Array[2]+"%";
                            	return "日期 : "+Array[5].nonsense+"<br/>"+Array[5].fuckOff+"<br/>"+Array[0]+" : "+Array[2]+"%";
                            }
                        },
                        legend: {
                            data:data.legend,
                            x:'left',
                            y:20
                        },
                        dataZoom : {
                            show : true,
                            realtime : true,
                            dataBackgroundColor:'#ccc',
                            start : 0,
                            end : 100
                        },
                        toolbox: {
                            itemSize:20,
                            show : true,
                            y:20,
                            feature : {
                                saveAsImage : {show: true}
                            }
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : data.footer
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            },
                            {
                                type : 'value'
                            }
                        ],
                        series :data.series
                    };
                    var myChart = ec.init($(ele)[0])
                    myChart.setOption(option);
                }
            );
        }
    }



});