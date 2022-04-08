import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import ReactApexChart from "react-apexcharts";
import {
    findPostOfDepartment,
    tokenRequestInterceptor,
} from "../../apiServices/index.js";
import { getNewToken } from '../../store/actions/authenticateAction'

function DepartmentChart({ authenticateReducer, getNewTokenRequest }) {

    const { token } = authenticateReducer;

    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);

    const loadData = useCallback(async () => {
        const department = [];
        const count = [];
        const loadAllDataOfIdea = async () => {
            const { data, status } = await findPostOfDepartment(token);
            return { data, status };
        };      
        const { status, data } = await tokenRequestInterceptor(
            loadAllDataOfIdea,
            getNewTokenRequest
        );
        if (status === 200) {
            data.map(async item => {
                console.log(item.user);
                await department.push(item.user[0].fullname);
                await count.push(item.count);
                setCategories(department)
                setData(count)
            })
        }
    }, [token, getNewTokenRequest])

    useEffect(() => {
        loadData();
    }, [loadData]);

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

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentChart);