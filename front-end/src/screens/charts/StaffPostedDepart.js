import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import {
    StaffPostedOrNotOfDepart,
    tokenRequestInterceptor,
} from "../../apiServices/index.js";
import { getNewToken } from '../../store/actions/authenticateAction'

function StaffPostedDepart({ authenticateReducer, getNewTokenRequest }) {

    const { token } = authenticateReducer;

    const [data, setData] = useState([]);

    const loadData = useCallback(async () => {
        const count = [];
        const loadAllDataOfIdea = async () => {
            const { data, status } = await StaffPostedOrNotOfDepart(token);
            return { data, status };
        };
        const { status, data } = await tokenRequestInterceptor(
            loadAllDataOfIdea,
            getNewTokenRequest
        );
        if (status === 200) {
            data.map(async item => {
                await count.push(item.StaffPosted, item.StaffnoPosted);
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
                type="pie"
                width="100%"
                options={{
                    labels: ["StaffPosted", "StaffNoPosted"]
                }}
                series={
                    data
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(StaffPostedDepart);