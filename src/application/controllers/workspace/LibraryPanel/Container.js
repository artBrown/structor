/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { forOwn, isObject } from 'lodash';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import {recentGroupKey} from './constants';

const style = {
    position: 'relative',
    width: '100%',
    marginTop: '5px'
};

const labelStyle = {
    backgroundColor: 'rgb(227, 227, 227)',
    color: 'rgb(107, 107, 107)',
    textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = { filer: '' };
        this.handleChangeFind = this.handleChangeFind.bind(this);
        this.handleClearFind = this.handleClearFind.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.handleToggleGroup = this.handleToggleGroup.bind(this);
        // this.handlePreviewComponent = this.handlePreviewComponent.bind(this);
        this.handleQuickCopyToClipboard = this.handleQuickCopyToClipboard.bind(this);
    }

    handleChangeFind(e) {
        var value = this.refs.inputElement.value;
        var newState = {
            filter: value
        };
        this.setState(newState);
    }

    handleOnKeyDown(e) {
        if (e.keyCode == 27) {
            this.handleClearFind(e);
        }
    }

    handleClearFind(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({filter: ''});
    }

    handleToggleGroup(e){
        e.stopPropagation();
        e.preventDefault();
        const key = e.currentTarget.dataset.groupkey;
        this.props.togglePanelGroup(key);
    }

    // handlePreviewComponent(e){
    //     e.preventDefault();
    //     e.stopPropagation();
    //     const { previewComponent } = this.props;
    //     const componentName = e.currentTarget.dataset.component;
    //     if(previewComponent && componentName){
    //         previewComponent(componentName);
    //     }
    // }

    handleQuickCopyToClipboard(e){
        e.preventDefault();
        e.stopPropagation();
        const { quickCopyToClipboard } = this.props;
        const componentName = e.currentTarget.dataset.component;
        if(quickCopyToClipboard && componentName){
            quickCopyToClipboard(componentName);
        }
    }

    makeTitle(componentName){
        let titleComponentName = componentName;
        if(titleComponentName.length > 23){
            titleComponentName = titleComponentName.substr(0, 20) + '...';
        }
        return titleComponentName;
    }

    render() {

        const {
            componentModel: {
                recentlyUsed,
                expandedGroupKeys,
                componentsTree : componentTreeModel
            }
        } = this.props;
        const { filter } = this.state;

        let libGroups = [];
        let groupHeaderKey = 0;
        let counter = 0;

        const filterString = filter ? filter.toUpperCase() : null;
        if(!filter && recentlyUsed && recentlyUsed.length > 0){
            let collapsed = "";
            if(expandedGroupKeys[recentGroupKey] === true){
                collapsed = "in";
            }
            let components = [];
            recentlyUsed.forEach((componentName, index) => {
                components.push(
                    <a key={componentName}
                       className={'list-group-item'}
                       href="#"
                       title={'Copy to clipboard ' + componentName}
                       data-component={componentName}
                       onClick={this.handleQuickCopyToClipboard}>
                        <span>{this.makeTitle(componentName)}</span>
                    </a>
                );
            });
            libGroups.push(
                <div key={recentGroupKey}
                     className="panel panel-info">
                    <div className="panel-heading"
                         role="tab"
                         id="headingOne">
                        <p style={{margin: 0}}>
                            <a style={{outline: '0'}}
                               role="button"
                               data-groupkey={recentGroupKey}
                               href={'#' + recentGroupKey}
                               onClick={this.handleToggleGroup}
                            >
                                Recently Used
                            </a>
                            <span
                                className="label pull-right"
                                style={labelStyle}
                            >
                                {components.length}
                            </span>
                        </p>
                    </div>
                    <div id={recentGroupKey}
                         className={"panel-collapse collapse " + collapsed}
                         role="tabpanel">
                        <div className="list-group">
                            {components}
                        </div>
                        <div style={{height: '0'}}></div>
                    </div>
                </div>
            );
        }
        forOwn(componentTreeModel, (group, groupName) => {
            if(isObject(group)){
                let components = [];
                forOwn(group, (componentTypeValue, componentName) => {
                    if(filter){
                        if(componentName.toUpperCase().includes(filterString)){
                            components.push(
                                <a key={componentName}
                                   className={'list-group-item'}
                                   href="#"
                                   title={'Copy to clipboard ' + componentName}
                                   data-component={componentName}
                                   onClick={this.handleQuickCopyToClipboard}
                                >
                                    <span>{this.makeTitle(componentName)}</span>
                                </a>
                            );
                        }
                    } else {
                        components.push(
                            <a key={componentName}
                               className={'list-group-item'}
                               href="#"
                               title={'Copy to clipboard ' + componentName}
                               data-component={componentName}
                               onClick={this.handleQuickCopyToClipboard}>
                                <span>{this.makeTitle(componentName)}</span>
                            </a>
                        );
                    }
                });
                let key = 'groupKey' + ++groupHeaderKey;
                if(components.length > 0){
                    let keySuffix = filter ? '12' : '0';
                    let id = 'group' + groupName + counter + keySuffix;
                    let collapsed = "";
                    if(!!filter){
                        collapsed = "in";
                    } else if(expandedGroupKeys[key] === true){
                        collapsed = "in";
                    }
                    libGroups.push(
                        <div key={key}
                             className="panel panel-default"
                        >
                            <div className="panel-heading"
                                 role="tab"
                                 id="headingOne"
                            >
                                <p style={{margin: 0}}>
                                    <a style={{outline: '0'}}
                                       role="button"
                                       data-groupkey={key}
                                       href={'#' + id}
                                       onClick={this.handleToggleGroup}
                                    >
                                        {groupName}
                                    </a>
                                    <span
                                        className="label pull-right"
                                        style={labelStyle}
                                    >
                                        {components.length}
                                    </span>
                                </p>
                            </div>
                            <div id={id}
                                 className={"panel-collapse collapse " + collapsed}
                                 role="tabpanel"
                            >
                                <div className="list-group">
                                    {components}
                                </div>
                                <div style={{height: '0'}} />
                            </div>
                        </div>
                    );
                }
            }
            counter++;
        });

        return (
            <div style={{paddingTop: '5px'}}>
                <div className="input-group input-group-sm">
                    <input
                        ref='inputElement'
                        type="text"
                        className="form-control"
                        placeholder="Filter..."
                        value={this.state.filter}
                        onKeyDown={this.handleOnKeyDown}
                        onChange={this.handleChangeFind} />
                    <span className="input-group-btn">
                        <button
                            className="btn btn-default"
                            type="button"
                            onClick={this.handleClearFind}
                        >
                            <span className="fa fa-times" />
                        </button>
                    </span>
                </div>
                <div ref='container' style={style}>
                    <div
                        className="panel-group"
                        id="accordion"
                        role="tablist"
                        aria-multiselectable="true"
                        ref="panelGroup">
                        {libGroups}
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);
