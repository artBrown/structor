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

import * as actions from './actions.js';

const initialState = {
    generators: {},
    recentGenerators: [],
    scaffoldGenerators: [],
    filter: {
        groupKey: actions.ALL_GROUP_KEY,
        groupName: actions.ALL_GROUP_KEY,
        groupNameBack: null
    },
    selectedTabKey: 3,
    searchText: '',
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_GENERATORS){
        return Object.assign({}, state, {
            generators: payload.generators || {},
        });
    }

    if(type === actions.SET_RECENT_GENERATORS){
        return Object.assign({}, state, {
            recentGenerators: payload || {}
        });
    }

    if(type === actions.SET_SCAFFOLD_GENERATORS){
        return Object.assign({}, state, {
            scaffoldGenerators: payload || []
        });
    }

    if(type === actions.SET_FILTER){
        return Object.assign({}, state, {
            filter: payload
        });
    }

    if(type === actions.SET_SELECTED_TAB){
        return Object.assign({}, state, {
            selectedTabKey: payload
        });
    }

    return state;
}

