import { Component } from "react";

import ITagData from "../types/tag.type";
import SmallLoadingSpinner from "./small-loading.component";

type Props = {
    tags?: ITagData[]
    warp?: boolean
    showDeleteIcon?: boolean
    onDelete?: (indexOfItem: number, tagId?: number) => Promise<void> | void
};

type State = {
    loading: boolean
    currentTagIndex: number
};

export default class TagList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.deleteTag = this.deleteTag.bind(this);

        this.state = {
            loading: false,
            currentTagIndex: -1
        };
    }

    deleteTag(indexOfItem: number, tagId: number) {
        const { onDelete } = this.props;
        console.log('aqui', onDelete);
        if (onDelete) {
            this.setState({ loading: true });

            onDelete(indexOfItem, tagId)

            this.setState({ loading: false })
        }
    }

    render() {
        const { tags, warp, showDeleteIcon } = this.props;
        const { loading } = this.state;

        return (
            <div className={`tag-list ${warp ? 'warp' : ''}`} >
                {tags?.map((tag: ITagData, index: number) => (
                    <div className="tags-item" key={index} >
                        <div className={`icon tag`} />
                        <span>{tag.tagName}</span>
                        {showDeleteIcon ? (
                            <div className={`delete-tag`} onClick={() => this.deleteTag(index, tag.id as number)}>
                                {loading ? <SmallLoadingSpinner /> : (<>&times;</>)}
                            </div>
                        ) : (<></>)}
                    </div>
                ))}
            </div>
        );
    }
}