import { Component } from "react";

import ITagData from "../types/tag.type";

type Props = {
    tags?: ITagData[]
};

type State = {};

export default class TagList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    render() {
        const { tags } = this.props;
        return (
            <div className="tag-list" >
                {tags?.map((tag: ITagData, index: number) => (
                    <div className="tags-item" key={index}>
                        <div className={`icon tag`} />
                        <span>{tag.tagName}</span>
                    </div>
                ))}
            </div>
        );
    }
}