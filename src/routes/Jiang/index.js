import React, { Component } from 'react';
import { Select, Input, Form, Row, Col, Table, Modal, Tabs } from 'antd';
import { connect } from 'dva';
import { StickyContainer, Sticky } from 'react-sticky';
import Stock from '../../components/Stock/Stock';
import Styles from './index.less';
import add from '../../../public/add.png';
import * as Service from '../../services/api';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const FormItem = Form.Item;
const isChineseReg = /[\u4e00-\u9fa5]/g;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 10, background: '#000' }} />
    )}
  </Sticky>
);

// const children = [];
// for (let i = 10; i < 36; i += 1) {
//   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
// }

@connect(({ Futu, loading }) => ({
  Futu,
  loading: loading.effects['Futu/fetch'],
}))
@Form.create({})
export default class JiangForm extends Component {
  state = {
    stockData: {},
    syncInfo: {},
    visible: false,
  };

  componentWillMount() {
    this.getStockList();
  }

  // componentDidMount() {
  //   this.delayTimeStock = this.delayTime(this.delayFetchStocks.bind(this));
  // }

  shouldComponentUpdate() {
    return true;
  }

  handleChange = value => {
    const {
      stockData: { codeList },
    } = this.state;
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    console.info(666, valueTrue);
    Service.queryTdSymbolsInfoData(valueTrue).then(res => {
      if (res && res.success) {
        const {
          data: { data },
        } = res;
        this.setState({
          syncInfo: data,
        });
      } else {
        this.setState({
          syncInfo: {},
        });
      }
    });
  };

  handlePopChange = value => {
    const {
      stockData: { codeList },
    } = this.state;
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    console.info(666, valueTrue);
    Service.queryTdSymbolsInfoData(valueTrue).then(res => {
      if (res && res.success) {
        const {
          data: { data },
        } = res;
        this.setState({
          syncInfo: data,
        });
      } else {
        this.setState({
          syncInfo: {},
        });
      }
    });
  };

  onSearchStocks = value => {
    // const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    // Service.queryTdSymbolsInfoData(valueTrue)
    //   .then((res) => {
    //     if (res && res.success) {
    //       const { data: { data } } = res;
    //       this.setState({
    //         stockData: data,
    //       })
    //     } else {
    //       this.setState({
    //         stockData: {},
    //       })
    //     }
    //   });
  };

  onPopSearchStocks = value => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    Service.queryTdSymbolsInfoData(valueTrue).then(res => {
      if (res && res.success) {
        const {
          data: { data },
        } = res;
        this.setState({
          stockData: data,
        });
      } else {
        this.setState({
          stockData: {},
        });
      }
    });
  };

  onBlurStocks = e => {
    Service.queryTdSymbolsInfoData(e.target.value.toUpperCase()).then(res => {
      console.info(3333, res);
      if (res && res.success) {
        const {
          data: { data },
        } = res;
        console.info(5555, data);
        this.setState({
          stockData: data,
        });
      } else {
        this.setState({
          stockData: {},
        });
      }
    });
  };

  getStockList(value) {
    this.setState({
      stopStockPage: 1,
    });
    const obj = value ? { StockName: value } : {};
    Service.queryTdSymbolsInfoData(obj).then(res => {
      if (res.datas && res.isSuccess) {
        const list = res.datas.data;
        const StockInfo = JSON.parse(list);
        const StockList = StockInfo.Entities;
        const pageInfo = StockInfo.PageInfo;
        this.setState({
          Stocks: StockList,
          StockPageInfo: pageInfo,
        });
      }
    });
  }

  // delay 获取stock数据
  delayFetchStocks(value) {
    if (value === '') {
      // 容错率
      this.getStockList();
    } else if (value.match(isChineseReg)) {
      // 性能优化
      if (value.length === value.match(isChineseReg).length) {
        this.getStockList(value);
      } else if (!/^[\u4e00-\u9fa5]{1,}[a-zA-Z]{0,}/g.test(value)) {
        this.setState({
          stocks: [],
        });
      }
    }
  }

  // h
  getStockChildren = dataSource => {
    // const { stockData } = this.state;
    // const { codeList = [] } = stockData;
    const children = [];
    if (dataSource.length !== 0) {
      const len = dataSource.length;
      for (let i = 0; i < len; i += 1) {
        children.push(
          <Option title={dataSource[i].symbol} className={Styles.stockSelectOption} key={i}>
            {`[${dataSource[i].symbol}]${dataSource[i].title}`}
          </Option>
        );
      }
      return children;
    }
  };

  getPopStockChildren = () => {
    const { stockData } = this.state;
    const { codeList = [] } = stockData;
    const children = [];
    if (codeList.length !== 0) {
      const len = codeList.length;
      for (let i = 0; i < len; i += 1) {
        children.push(
          <Option title={codeList[i].symbol} className={Styles.stockSelectOption} key={i}>
            {`[${codeList[i].symbol}]${codeList[i].title}`}
          </Option>
        );
      }
      return children;
    }
  };

  onImgAdd = () => {
    console.info('3333');
    this.setState({
      visible: true,
    });
  };

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    console.log('点击了确定');
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    // const test = array.some((item, index) => {
    //   if (item === 1) {
    //     return true;
    //   }
    //   return false;
    // });

    // console.info(1111, test);

    // const result = [];
    // array.forEach((item, index) => {
    //   if (result.indexOf(array[index]) === -1) {
    //     result.push(array[index]);
    //   }
    // });
    //
    // console.info(111, result);

    return (
      <div>
        {/* Other elements can be in between `StickyContainer` and `Sticky`,
        but certain styles can break the positioning logic used. */}
        {/*<Sticky>*/}
          {/*{({*/}
            {/*style,*/}

            {/*// the following are also available but unused in this example*/}
            {/*isSticky,*/}
            {/*wasSticky,*/}
            {/*distanceFromTop,*/}
            {/*distanceFromBottom,*/}
            {/*calculatedHeight,*/}
          {/*}) => <header style={style}>111111111</header>}*/}
        {/*</Sticky>*/}
        <div>22222</div>
        <div>22222</div>
        <div>22222</div>
        <div>22222</div>
      </div>
    );
  }

  // render() {
  //   const { visible } = this.state;
  //   // single search model for search input text
  //   // const searchShowModel = (info) => {
  //   //   const syncInfoTrue = info.syncInfo;
  //   //   const syncInfoTrueOk = Object.keys(syncInfoTrue).map((e) => {
  //   //     return { 'time': e, 'startDate': syncInfoTrue[e].startDate, 'endDate': syncInfoTrue[e].endDate }
  //   //   });
  //   //   return syncInfoTrueOk.map((item, index) => {
  //   //     const { time, startDate, endDate } = item;
  //   //     return (
  //   //       <div style={{ display: 'block' }}>
  //   //         <div style={{ width: '12%', float: 'left', fontSize: 20 }}>{time}:</div>
  //   //         <div style={{ width: '88%', float: 'left', fontSize: 20, color: '#1890ff' }}>{`startDate:${startDate};endDate:${endDate}`}</div>
  //   //       </div>)
  //   //   });
  //   // };
  //
  //   const dataSource = [
  //     {
  //       key: '1',
  //       symbol: 'US.APPL',
  //       title: '苹果',
  //       date: '2018-1-1',
  //     },
  //     {
  //       key: '2',
  //       symbol: 'US.HUYA',
  //       title: '虎牙',
  //       date: '2018-1-1',
  //     },
  //     {
  //       key: '3',
  //       symbol: 'US.APPL2',
  //       title: '苹果',
  //       date: '2018-1-1',
  //     },
  //     {
  //       key: '4',
  //       symbol: 'US.HUYA2',
  //       title: '虎牙',
  //       date: '2018-1-1',
  //     },
  //     {
  //       key: '5',
  //       symbol: 'US.APPL3',
  //       title: '苹果',
  //       date: '2018-1-1',
  //     },
  //     {
  //       key: '6',
  //       symbol: 'US.HUYA3',
  //       title: '虎牙',
  //       date: '2018-1-1',
  //     },
  //   ];
  //
  //   const columns = [
  //     {
  //       title: 'Symbol',
  //       dataIndex: 'symbol',
  //       key: 'symbol',
  //     },
  //     {
  //       title: 'Title',
  //       dataIndex: 'title',
  //       key: 'title',
  //     },
  //     {
  //       title: 'Date',
  //       dataIndex: 'date',
  //       key: 'date',
  //     },
  //   ];
  //
  //   return (
  //     <div>
  //       <StickyContainer>
  //         <Sticky>{({ style }) => <h1 style={style}>Sticky element</h1>}</Sticky>
  //       </StickyContainer>
  //       {/*<StickyContainer>*/}
  //         {/*<Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>*/}
  //           {/*<TabPane tab="Tab 1" key="1" style={{ height: 200 }}>Content of Tab Pane 1</TabPane>*/}
  //           {/*<TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>*/}
  //           {/*<TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>*/}
  //         {/*</Tabs>*/}
  //       {/*</StickyContainer>*/}
  //       <div>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Select
  //               showSearch
  //               filterOption={false}
  //               placeholder="Please select"
  //               onSearch={this.onSearchStocks.bind(this)}
  //               onChange={this.handleChange.bind(this)}
  //               style={{ width: '100%' }}
  //             >
  //               {this.getStockChildren(dataSource)}
  //             </Select>
  //           </Col>
  //         </Row>
  //       </div>
  //       <div style={{ marginTop: 20 }}>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Table
  //               dataSource={dataSource}
  //               columns={columns}
  //             />
  //           </Col>
  //           <Col md={12} sm={24}>
  //             <img
  //               alt="0"
  //               src={add}
  //               style={{ width: 16, cursor: 'pointer' }}
  //               onClick={this.onImgAdd.bind(this)}
  //             />
  //           </Col>
  //         </Row>
  //       </div>
  //       <div>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Select
  //               showSearch
  //               filterOption={false}
  //               placeholder="Please select"
  //               onSearch={this.onSearchStocks.bind(this)}
  //               onChange={this.handleChange.bind(this)}
  //               style={{ width: '100%' }}
  //             >
  //               {this.getStockChildren(dataSource)}
  //             </Select>
  //           </Col>
  //         </Row>
  //       </div>
  //       <div style={{ marginTop: 20 }}>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Table
  //               dataSource={dataSource}
  //               columns={columns}
  //             />
  //           </Col>
  //           <Col md={12} sm={24}>
  //             <img
  //               alt="0"
  //               src={add}
  //               style={{ width: 16, cursor: 'pointer' }}
  //               onClick={this.onImgAdd.bind(this)}
  //             />
  //           </Col>
  //         </Row>
  //       </div>
  //       <div>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Select
  //               showSearch
  //               filterOption={false}
  //               placeholder="Please select"
  //               onSearch={this.onSearchStocks.bind(this)}
  //               onChange={this.handleChange.bind(this)}
  //               style={{ width: '100%' }}
  //             >
  //               {this.getStockChildren(dataSource)}
  //             </Select>
  //           </Col>
  //         </Row>
  //       </div>
  //       <div style={{ marginTop: 20 }}>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Table
  //               dataSource={dataSource}
  //               columns={columns}
  //             />
  //           </Col>
  //           <Col md={12} sm={24}>
  //             <img
  //               alt="0"
  //               src={add}
  //               style={{ width: 16, cursor: 'pointer' }}
  //               onClick={this.onImgAdd.bind(this)}
  //             />
  //           </Col>
  //         </Row>
  //       </div>
  //       <div>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Select
  //               showSearch
  //               filterOption={false}
  //               placeholder="Please select"
  //               onSearch={this.onSearchStocks.bind(this)}
  //               onChange={this.handleChange.bind(this)}
  //               style={{ width: '100%' }}
  //             >
  //               {this.getStockChildren(dataSource)}
  //             </Select>
  //           </Col>
  //         </Row>
  //       </div>
  //       <div style={{ marginTop: 20 }}>
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Table
  //               dataSource={dataSource}
  //               columns={columns}
  //             />
  //           </Col>
  //           <Col md={12} sm={24}>
  //             <img
  //               alt="0"
  //               src={add}
  //               style={{ width: 16, cursor: 'pointer' }}
  //               onClick={this.onImgAdd.bind(this)}
  //             />
  //           </Col>
  //         </Row>
  //       </div>
  //       <Modal
  //         title=""
  //         visible={visible}
  //         onOk={this.handleOk.bind(this)}
  //         onCancel={this.handleCancel.bind(this)}
  //         footer={false}
  //         style={{ height: 200 }}
  //       >
  //         <Row gutter={24}>
  //           <Col md={12} sm={24}>
  //             <Select
  //               showSearch
  //               filterOption={false}
  //               placeholder="Please select"
  //               onSearch={this.onPopSearchStocks.bind(this)}
  //               onChange={this.handlePopChange.bind(this)}
  //               style={{ width: '100%' }}
  //             >
  //               {this.getPopStockChildren()}
  //             </Select>
  //           </Col>
  //         </Row>
  //       </Modal>
  //     </div>
  //   );
  // }
}