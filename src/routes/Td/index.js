import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table } from 'antd';
import { connect } from 'dva';
import { ToDecimal, ResultToSign } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import * as Service from '../../services/td';
import styles from './index.less';

const { Option } = Select;

@connect(({ Td, loading }) => ({
  Td,
  loading: loading.effects['Td/fetch'],
}))

export default class TdForm extends Component {
  state = {
    stockData: {},
    syncInfo: {},
    searchLoading: false,
  };

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  // on search stocks
  onSearchClick = (value) => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    Service.queryTdSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            stockData: data,
          })
        } else {
          this.setState({
            stockData: {},
          })
        }
      });
  };

  // achieve the stock symbol
  getSearchChildText() {
    const { stockData } = this.state;
    const { codeList = [] } = stockData;
    const children = [];
    if (codeList.length !== 0) {
      const len = codeList.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option
          title={codeList[i].symbol}
          className={styles.stockSelectOption}
          key={i}
        >{`[${codeList[i].symbol}]${codeList[i].title}`}
        </Option>);
      }
      return children;
    }
  }

  // on search stocks
  onSearchChangeClick = (value) => {
    const { stockData: { codeList } } = this.state;
    this.setState({
      searchLoading: true,
    });
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    Service.queryTdSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            syncInfo: data,
            searchLoading: false,
          })
        } else {
          this.setState({
            syncInfo: {},
            searchLoading: false,
          })
        }
      });
  };

  // td sync data button click
  onOpenCloseClick = (str) => {
    const { dispatch } = this.props;
    if (str === 'open') {
      dispatch({
        type: 'Td/fetchStart',
      });
    } else if (str === 'close') {
      dispatch({
        type: 'Td/fetchStop',
      });
    }
  };

  render() {
    const { loading, Td: { syncData, progressData } } = this.props;
    const { lastSyncStocks, currentProgress, eta, syncedSymbol } = progressData;
    const { status } = syncData;
    // search column
    const columnSearch = [
      {
        title: 'Freq',
        dataIndex: 'time',
        render: (text, record) => {
          const { time } = record;
          let timeStr;
          if (record.time === '1M') {
            timeStr = '1min';
          } else {
            timeStr = `${time  }ins`;
          }
          return (<span>{ResultToSign(timeStr)}</span>);
        },
        key: 'time',
        width: '15%',
      },
      {
        title: 'Sync Datetime range',
        dataIndex: 'startDate',
        render: (text, record) => {
          return (<a>{ResultToSign(`${record.startDate}-${record.endDate}`)}</a>);
        },
        key: 'startDate',
        width: '85%',
      }];

    // progress column
    const columnProgress = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        width: '27%',
      },
      {
        title: 'Freq',
        dataIndex: 'frequency',
        key: 'frequency',
        width: '14%',
      },
      {
        title: 'Cnt',
        dataIndex: 'count',
        key: 'count',
        width: '13%',
      },
      {
        title: 'SyncDateTime',
        dataIndex: 'syncDateTime',
        key: 'syncDateTime',
        width: '46%',
      }];

    const { syncInfo, searchLoading } = this.state;
    let syncInfoTrueOk = [];
    if (Object.keys(syncInfo).length >= 1) {
      const syncInfoTrue = syncInfo.syncInfo;
      syncInfoTrueOk = Object.keys(syncInfoTrue).map((e) => {
        return { 'time': e, 'startDate': syncInfoTrue[e].startDate, 'endDate': syncInfoTrue[e].endDate }
      });
    }

    // single sync model for synchronization data details
    const singleSyncModel = (property, detail, propertyStyle) => {
      return (
        <div style={Object.assign({}, propertyStyle ? {} : { marginTop: 10 })}>
          <Row gutter={24}>
            <Col
              xs={{ span: 15 }}
              sm={{ span: 12 }}
              md={{ span: 9, offset: 1 }}
              lg={{ span: 9, offset: 1 }}
              xl={{ span: 9, offset: 1 }}
              xxl={{ span: 9, offset: 1 }}
            >
              <div style={Object.assign({}, propertyStyle ? { height: 30, innerHeight: 30, marginTop: 10 } : {})}>{property}</div>
            </Col>
            <Col
              xs={{ span: 9 }}
              sm={{ span: 12 }}
              md={{ span: 14 }}
              lg={{ span: 14 }}
              xl={{ span: 14 }}
              xxl={{ span: 14 }}
            >
              <div style={Object.assign({}, propertyStyle ? { fontSize: 30, color: '#3b78e7' } : {})}>{detail}</div>
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <div>
        {/* first. Td sync data switch  */}
        <div className={styles.subProperty}>Td sync data switch</div>
        <div>
          <Row gutter={24}>
            <Col
              xs={{ span: 12 }}
              sm={{ span: 12 }}
              md={{ span: 9, offset: 1 }}
              lg={{ span: 9, offset: 1 }}
              xl={{ span: 9, offset: 1 }}
              xxl={{ span: 9, offset: 1 }}
            >
              <div>
                {parseInt(status, 10) === 0 ? 'not turned on:' : 'turned on:'}
                {parseInt(status, 10) === 0 ? <img style={{ width: 16 }} alt={1} src={rhombusNo} /> : <img style={{ width: 16 }} alt={2} src={rhombus} />}
              </div>
            </Col>
            <Col
              xs={{ span: 12 }}
              sm={{ span: 12 }}
              md={{ span: 14 }}
              lg={{ span: 14 }}
              xl={{ span: 14 }}
              xxl={{ span: 14 }}
            >
              <Button
                type="primary"
                onClick={this.onOpenCloseClick.bind(this, 'open')}
                style={{ marginRight: 10 }}
              >open
              </Button>
              <Button
                type="primary"
                onClick={this.onOpenCloseClick.bind(this, 'close')}
              >close
              </Button>
            </Col>
          </Row>
        </div>
        {/* second.Td search stock text */}
        <div className={styles.subProperty}>Td search stock text</div>
        <div>
          <Row gutter={24}>
            <Col
              xs={{ span: 16 }}
              sm={{ span: 16 }}
              md={{ span: 16, offset: 1 }}
              lg={{ span: 16, offset: 1 }}
              xl={{ span: 16, offset: 1 }}
              xxl={{ span: 16, offset: 1 }}
            >
              <Select
                showSearch
                filterOption={false}
                placeholder="input search stock text"
                onSearch={this.onSearchClick.bind(this)}
                onChange={this.onSearchChangeClick.bind(this)}
                style={{ width: '100%', marginBottom: 10 }}
              >
                {this.getSearchChildText()}
              </Select>
            </Col>
          </Row>
          {Object.keys(syncInfo).length >= 1 ? (
            <Row gutter={24}>
              <Col span={24}>
                <Table
                  loading={searchLoading}
                  columns={columnSearch}
                  dataSource={syncInfoTrueOk}
                  pagination={false}
                />
              </Col>
            </Row>
          ) : null}
        </div>
        {/* third.Td synchronization data details */}
        <div className={styles.subProperty}>Td synchronization data details</div>
        {singleSyncModel('1.latest state of stocks :', syncedSymbol, true)}
        {singleSyncModel('2.how long remains :', eta ? `${(ToDecimal(eta / 3600)).toString()  }h` : 0, true)}
        {singleSyncModel('3.synchronization progress :', <Progress
          percent={parseFloat(ToDecimal(currentProgress * 100))}
          status="active"
        />, false)}
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 9, offset: 1 }}
              lg={{ span: 9, offset: 1 }}
              xl={{ span: 9, offset: 1 }}
              xxl={{ span: 9, offset: 1 }}
            >
              <div style={{ height: 30, innerHeight: 30, marginTop: 10 }}>4.the latest synchronized 25 stock data :</div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 23, offset: 1 }}
              lg={{ span: 23, offset: 1 }}
              xl={{ span: 23, offset: 1 }}
              xxl={{ span: 23, offset: 1 }}
            >
              <Table
                loading={loading}
                columns={columnProgress}
                dataSource={lastSyncStocks}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
