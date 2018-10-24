import React  from 'react';
import {toPairs, sortBy} from 'lodash-es';
import './PingsChart.css'

class PingsChart extends React.Component {

    render() {
        const {summary} = this.props.data;

        const header = <thead>
            <tr>
                <td className="host">Host name</td>
                <td className="avg">Average</td>
                <td className="stdDev">Std dev</td>
                <td className="percent">50/90/99%</td>
            </tr>
        </thead>;
        const longList = sortBy(toPairs(summary), '1.mean')
            .map(([host, {mean, standardDeviation, percentiles}]) => {
                return <tr>
                    <td className="host">{host}</td>
                    <td className="avg">{mean}ms</td>
                    <td className="stdDev">{standardDeviation}ms</td>
                    <td className="percent">{percentiles[50]}/{percentiles[90]}/{percentiles[99]}</td>
                </tr>
            });

        return (
            <div className="PingsChart">
                <table>
                    {header}
                    <tbody>
                        {longList}
                    </tbody>
                </table>
            </div>
        );
    }
}




export default PingsChart;
