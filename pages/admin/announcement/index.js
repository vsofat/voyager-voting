import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment-timezone/moment-timezone-utils";
import Link from "next/link";
import React, { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import layout from "./../../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    allAnnouncements(query: $query, page: $page) {
      page
      numPages
      results {
        id
        title
        body
        updatedAt
      }
    }
  }
`;

const AdminAnnouncements = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data } = useQuery(QUERY, { variables: { query, page } });

  const onPageChange = (ev, pg) => setPage(pg);

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Announcements | Admin Panel
      </Typography>

      <AdminTabBar />

      <div className={layout.center}>
        <Link href={"/admin/announcement/create"} passHref>
          <Button
            variant={"outlined"}
            startIcon={<Add />}
            color={"secondary"}
            className={layout.spaced}
          >
            Create Announcement
          </Button>
        </Link>
      </div>

      <div className={layout.center}>
        <TextField
          label={"Search Announcements"}
          value={query}
          onChange={(ev) => {
            setQuery(ev.target.value);
            setPage(1);
          }}
          variant={"outlined"}
          color={"primary"}
          className={layout.spaced}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </div>

      <Container maxWidth={"sm"}>
        <List>
          {data?.allAnnouncements.results.map(({ id, title, updatedAt }) => (
            <>
              <ListItem alignItems="flex-start" key={id}>
                <ListItemText
                  primary={
                    <Typography
                      paragraph
                      className={layout.listItemPrimaryText}
                    >
                      {title}
                    </Typography>
                  }
                  secondary={
                    "Last Updated: " +
                    moment(updatedAt).format("MMMM Do YYYY, h:mm:ss a z")
                  }
                />

                <ListItemSecondaryAction>
                  <Link href={"/admin/announcement/" + id}>
                    <Button color={"secondary"} variant={"contained"}>
                      View
                    </Button>
                  </Link>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Container>

      <div className={layout.center}>
        <Pagination
          count={data?.allAnnouncements.numPages || 1}
          page={page}
          onChange={onPageChange}
        />
      </div>
    </Container>
  );
};

export default AdminAnnouncements;
