import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import {
    countIdea,
    tokenRequestInterceptor,
} from "../../apiServices/index.js";
import { getNewToken } from '../../store/actions/authenticateAction'

function Diagram({ authenticateReducer, getNewTokenRequest }) {

    const { token } = authenticateReducer;

    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);

    const loadData = useCallback(async () => {
        const department = [];
        const count = [];
        const loadAllDataOfIdea = async () => {
            const { data, status } = await countIdea(token);
            return { data, status };
        };      
        const { status, data } = await tokenRequestInterceptor(
            loadAllDataOfIdea,
            getNewTokenRequest
        );
        if (status === 200) {
            data.map(item => {
                department.push(item._id);
                count.push(item.count);
                setCategories(department)
                setData(count)
            })
        }
    }, [token, getNewTokenRequest])

    useEffect(() => {
        loadData();
    }, [loadData]);

    console.log(data);

    return (
        <div>
            <ReactApexChart
                options={{
                    chart: {
                        id: 'apexchart-example'
                    },
                    xaxis: {
                        categories: categories
                    }
                }}
                series={[{
                    name: 'series-1',
                    data: data
                }]}
                type="bar"
                height={350}
            />

            <Chart
                type="pie"
                width={300}
                height={300}
                series={
                    data
                }
                options={{
                    labels: categories
                }}
            >
            </Chart>

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

export default connect(mapStateToProps, mapDispatchToProps)(Diagram);