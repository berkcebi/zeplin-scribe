import React, { useState, useEffect } from "react";
import { Project, Screen, ScreenNote, ScreenNoteStatusEnum } from "@zeplin/sdk";
import Header from "./Header";
import zeplin from "./zeplin";

const REQUEST_LIMIT = 100;
const ZEPLIN_BASE_URL = "https://app.zeplin.io";

type CommentCollection = {
    screen: Screen;
    comments: ScreenNote[];
};

function Comments(props: { project: Project; onBack: () => void }) {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingDescription, setLoadingDescription] = useState("");
    const [commentCollections, setCommentCollections] = useState<
        CommentCollection[]
    >([]);

    useEffect(() => {
        let didCancel = false;

        (async () => {
            const screens: Screen[] = [];
            let fetchNextPage = true;
            while (!didCancel && fetchNextPage) {
                const response = await zeplin.screens.getProjectScreens(
                    props.project.id,
                    {
                        limit: REQUEST_LIMIT,
                        offset: screens.length,
                    }
                );

                const responseScreens = response.data;
                screens.push(...responseScreens);

                if (responseScreens.length < REQUEST_LIMIT) {
                    fetchNextPage = false;
                }
            }

            const commentCollections: CommentCollection[] = [];
            // TODO: Fetch in parallel.
            for (let index = 0; index < screens.length; index++) {
                const screen = screens[index];

                setLoadingDescription(
                    `${index + 1} of ${screens.length} screens`
                );
                const response = await zeplin.screens.getScreenNotes(
                    props.project.id,
                    screen.id,
                    {
                        // Assume no screen has more than 100 comments.
                        limit: REQUEST_LIMIT,
                    }
                );

                if (didCancel) {
                    break;
                }

                const comments = response.data;
                const openComments = comments.filter(
                    (comment) => comment.status === ScreenNoteStatusEnum.OPEN
                );

                if (openComments.length) {
                    commentCollections.push({
                        screen,
                        comments: openComments,
                    });

                    setCommentCollections(commentCollections);
                }
            }

            if (!didCancel) {
                setIsLoading(false);
            }
        })();

        return () => {
            didCancel = true;
        };
    }, [props.project]);

    const getScreenUrl = (screen: Screen): string => {
        return `${ZEPLIN_BASE_URL}/project/${props.project.id}/screen/${screen.id}`;
    };

    const getCommentUrl = (screen: Screen, comment: ScreenNote): string => {
        return `${getScreenUrl(screen)}?did=${comment.id}`;
    };

    return (
        <>
            <Header onBack={props.onBack}>
                <span className="secondary">Comments in</span>{" "}
                {props.project.name}
            </Header>
            <ul>
                {commentCollections.map((commentCollection) => (
                    <li key={commentCollection.screen.id}>
                        {commentCollection.comments.length} open comment
                        {commentCollection.comments.length > 1 && "s"}
                        <span className="secondary"> in </span>
                        <a
                            href={getScreenUrl(commentCollection.screen)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {commentCollection.screen.name}
                        </a>
                        <ul>
                            {commentCollection.comments.map((comment) => (
                                <li key={comment.id}>
                                    <a
                                        href={getCommentUrl(
                                            commentCollection.screen,
                                            comment
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        #{comment.order}
                                    </a>
                                    <span className="secondary"> from </span>
                                    {Array.from(
                                        new Set(
                                            comment.comments.map(
                                                (comment) =>
                                                    comment.author.username
                                            )
                                        )
                                    ).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            {isLoading ? (
                <p className="secondary">
                    Looking for open comments…
                    {loadingDescription.length > 0 &&
                        ` (${loadingDescription})`}
                </p>
            ) : (
                !commentCollections.length && <p>No open comments — nice!</p>
            )}
        </>
    );
}

export default Comments;
