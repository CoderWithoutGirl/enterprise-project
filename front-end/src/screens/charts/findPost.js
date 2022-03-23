import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import ReactApexChart from "react-apexcharts";
import {
    tokenRequestInterceptor,
    findPost
} from "../../apiServices/index.js";
import { getNewToken } from '../../store/actions/authenticateAction'

function FindPost({ authenticateReducer, getNewTokenRequest }) {
    const { token } = authenticateReducer;
    const [categories, setCategories] = useState([]);
    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])

    const loadData = useCallback(async () => {
        const department = [];
        const data1 = [];
        const data2 = [];
        const loadAllDataOfIdea = async () => {
            const { data, status } = await findPost(token);
            return { data, status };
        };
        const { status, data } = await tokenRequestInterceptor(
            loadAllDataOfIdea,
            getNewTokenRequest
        );
        if (status === 200) {
            data.map(async item => {
                await department.push(item.label);
                await data1.push(item.posted);
                await data2.push(item.noPosted);
                setCategories(department)
                setSeries1(data1)
                setSeries2(data2)
            })
        }
    }, [token, getNewTokenRequest])

    useEffect(() => {
        loadData();
    }, [loadData]);


    return (
        <div id="chart">
            <ReactApexChart
                options={{
                    chart: {
                        type: 'bar',
                        height: 430
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            dataLabels: {
                                position: 'top',
                            },
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        offsetX: -6,
                        style: {
                            fontSize: '12px',
                            colors: ['#fff']
                        }
                    },
                    stroke: {
                        show: true,
                        width: 1,
                        colors: ['#fff']
                    },
                    tooltip: {
                        shared: true,
                        intersect: false
                    },
                    xaxis: {
                        categories: categories
                    },
                }}
                series={[
                    {
                        name: 'posted',
                        data: series1
                    },
                    {
                        name: 'noPosted',
                        data: series2
                    }
                ]}
                type="bar"
                height={430}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNewTokenRequest: () => dispatch(getNewToken()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindPost);