import React from 'react';

const TagsSelect = ({ tags, values, setValues}) => {
    
    const handleTagSelect = tag_id => {
        let tagIDs = values.tags;
        if (!tagIDs.includes(tag_id)) tagIDs.push(tag_id);
        else tagIDs = tagIDs.filter(t => t !== tag_id);
        setValues({...values, tags: [...tagIDs]});
    }

    // const hiliteBox = (e) => {
    //     if (e.target.classList.contains('tag-box')) e.target.classList.toggle('selected-box');
    //     if (e.target.classList.contains('tag-name')) e.target.parentElement.classList.toggle('selected-box')
    // }



    return (
        <div className='tags-select-container'>
            {
                tags
                &&
                tags.map(tag => (
                    <div 
                        key={`tagid${tag.tag_id}`} 
                        onClick={(e) => {handleTagSelect(tag.tag_id); /*hiliteBox(e)*/}} 
                        className={values.tags.includes(Number(tag.tag_id)) ? 'tag-box selected-box' : 'tag-box'}
                    >
                        <p className='tag-name'>
                            {tag.name}
                        </p>
                    </div>
                ))
            }
        </div>
    )
}

export default TagsSelect


/*
 return (
        <div className='tags-select-container'>
            {
                tags
                &&
                tags.map(tag => (
                    <div key={`tagid${tag.tag_id}`} onClick={(e) => {handleTagSelect(tag.tag_id); hiliteBox(e)}} className='tag-box' >
                        <p className='tag-name'>{tag.name}</p>
                    </div>
                ))
            }
        </div>
    )
*/
