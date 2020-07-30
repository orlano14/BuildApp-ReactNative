import React from 'react';
import StaticC from '../Components/StaticC';
import { StyleSheet, View, ScrollView, Text, AsyncStorage, RefreshControl } from 'react-native';
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import PreloaderC from '../Components/PreloaderC';
import serverURL from '../assets/serverURL';



class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        }
        this.apiUrl = serverURL+'/api/';
        this.tableHead = ['Name', 'Avg', 'Helps', 'Points'];
    }
    componentDidMount = () => {
        this.FetchGetRanks()
    }
    FetchGetRanks = async () => {
        await this.GetSelfUserName().then((un) => {
            fetch(this.apiUrl + `Rank/GetRanks/${un}`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
                .then(res => {
                    return res.json()
                })
                .then(
                    (result) => {
                        this.setState({ rankTable: result })
                        return true;
                    },
                    (error) => {
                        console.log("err post=", error);
                        return false;
                    });
        })
    }
    GetSelfUserName = async () => {
        try {
            let u = JSON.parse(await AsyncStorage.getItem('MyUser'));

            if (u !== null) {
                return u.userName;
            }
        } catch (error) {
            console.log("Error geting AsyncStorege");
        }

    }
    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.FetchGetRanks();
        this.setState({ refreshing: false });
    }
    render() {
        const state = this.state;
        return (
            <StaticC isTabWindow={true}>
                {!this.state.rankTable ?
                    <PreloaderC /> :
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Icon
                                name='crown'
                                type='material-community'
                                color={'#FFB718'}
                                size={70} />
                            {this.state.rankTable.map((u, i) => ((this.state.rankTable[0].Helps * this.state.rankTable[0].Avg === u.Avg * u.Helps && u.Avg !== 0) && <Text key={`${i}-${u.FullName}`} style={[styles.text, { color: '#FFB718', fontWeight: 'bold', fontSize: 18 }]}>{u.FullName}</Text>))}
                        </View>
                        <View style={styles.body}>
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }>
                                <Table>
                                    <Row data={this.tableHead} flexArr={[2.5, 1, 1, 1]} style={styles.head} textStyle={[styles.text, { fontWeight: 'bold', fontSize: 18 }]} />
                                    {this.state.rankTable.map((rowData, i) => (
                                        <TableWrapper key={i} style={styles.row}>
                                            {(rowData.Helps !== 0 && rowData.Helps * rowData.Avg === this.state.rankTable[0].Helps * this.state.rankTable[0].Avg) ?
                                                <Cell key={i + 'rate'} style={{ flex: 0.5 }} data={
                                                    <Icon
                                                        name='crown'
                                                        type='material-community'
                                                        color={'#FFB718'}
                                                        size={20} />
                                                } textStyle={styles.text} /> :
                                                <Cell key={i + 'rate'} style={{ flex: 0.5 }} data={i + 1} textStyle={styles.text} />
                                            }
                                            <Cell key={i + 'name'} style={{ flex: 2 }} data={rowData.FullName} textStyle={[styles.text, { fontWeight: 'bold' }]} />
                                            <Cell key={i + 'avg'} data={rowData.Avg} textStyle={styles.text} />
                                            <Cell key={i + 'helps'} data={rowData.Helps} textStyle={styles.text} />
                                            <Cell key={i + 'Points'} data={(rowData.Helps * rowData.Avg).toFixed(1)} textStyle={styles.text} />

                                        </TableWrapper>
                                    ))}
                                </Table>
                            </ScrollView>

                        </View>
                    </View>
                }
            </StaticC>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flex: 0.3, justifyContent: 'center' },
    body: { flex: 0.7 },
    head: { height: 40, width: '95%', alignSelf: 'center', borderWidth: 1, borderColor: '#ddd' },
    row: { flexDirection: 'row', width: '95%', alignSelf: 'center', height: 50 },
    text: { textAlign: 'center', color: '#eee', fontSize: 16 }
});
export default Rank;