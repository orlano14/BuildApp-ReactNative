import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, I18nManager, Image, Dimensions } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Tooltip,Icon } from 'react-native-elements';
import TooltipUsers from './TooltipUsers';
import InfoBuilding from './InfoBuilding';


export default class StatusBuildingC extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.betterStatus={RequestStatus:0}
    }
    ClearBetterStatus=()=>{
        this.betterStatus={RequestStatus:0}
    }
    GetColorByStatus = (n) => {
        let c;
        switch (n) {
            case 0:
                c = '#666666'
                break;
            case 1:
                c = '#FA2F12'
                break;
            case 2:
                c = '#469EFF'
                break;
            case 3:
                c = '#31F049'
                break;
        }
        return c;
    }
    GetAppartmentTooltip=(data)=>{
        
        return (
            <TooltipUsers choosenAprData={data} requestUserConfirmed={this.props.requestUserConfirmed}></TooltipUsers>
        )
    }
    _infoView=()=>{
        return(
            <InfoBuilding/>
        )
    }

    render() {
        let dt=[]
        for (let index = this.props.statusBuilding.length-1; index >= 0; index--) {
            dt.push(this.props.statusBuilding[index])
        }
        const tableData=dt
        
        const element = (data,betterS, i, j) => (
            <View style={{ borderWidth: 5 + 8 * ((15 - tableData.length) / 15), borderColor: '#666666', padding: 6 }} >
                {betterS.RequestStatus>0?
                <Tooltip popover={this.GetAppartmentTooltip(data)} width={300} height={200}>
                    <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(betterS.RequestStatus), borderRadius: 5, alignSelf: 'center' }}>
                    </View>
                </Tooltip>:
                <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(betterS.RequestStatus), borderRadius: 5, alignSelf: 'center' }}>
                </View>
    }
                {this.ClearBetterStatus()}
            </View>
        );

        return (
            <View style={styles.container}>
                <View style={{backgroundColor:'#eee',borderRadius:30/2,position:'absolute',left:10,bottom:Dimensions.get('window').height/2-50}}>
                <Tooltip popover={this._infoView()} width={300} height={200} backgroundColor='#eee'>
                <Icon type='entypo' name='info-with-circle' size={30} color='#666' />
                </Tooltip>
                </View>
                <View style={{ marginLeft: '5%', marginRight: '5%', transform: [{ rotateX: "50deg" }] }}>
                    <Image source={require('../assets/buildingHeader.png')} style={{ width: '100%', height: 40 }} />
                    <Table borderStyle={{ borderColor: 'transparent' }}>
                        {
                            tableData.map((rowData, i) => (
                                <TableWrapper key={i} style={styles.row}>
                                    {
                                        rowData.map((cellData, j) => (
                                            cellData.forEach(s => {
                                                s.RequestStatus>=this.betterStatus.RequestStatus&&(this.betterStatus=s)
                                            }),
                                            <Cell key={j} data={element(cellData,this.betterStatus, i, j)} textStyle={styles.text} />
                                            ))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                    <Image source={require('../assets/buildingFooter.png')} style={{ width: '100%', height: 50 }} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 0.8, padding: 10, flexDirection: 'column', justifyContent: 'flex-end',marginTop:Dimensions.get('window').height-700},
    text: { margin: 6 },
    row: { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', backgroundColor: '#444444' },
});