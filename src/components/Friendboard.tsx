import { Button, Title, Table, Group, useMantineTheme } from "@mantine/core";
import { useFriends } from "../hooks/useFriends";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "./forms/FormikTextInput";
import { generateFriendCode } from "../utils/codeUtils";
import { useState } from "react";
import { handleErrorWithNotification } from "../utils/notificationErrorHandler";
import { prettyDuration } from "../utils/dateUtils";
import { sumBy } from "../utils/arrayUtils";
import { useActivityData } from "../hooks/useActivityData";
import { addDays, startOfDay } from "date-fns/esm";
import useAuthentication from "../hooks/UseAuthentication";

export const Friendboard = () => {
  const { addFriend, unFriend, friends } = useFriends();
  const entries = useActivityData();
  const { username } = useAuthentication();

  const entriesInRange = entries.filter(entry => {
    const startOfStatisticsRange = startOfDay(addDays(new Date(), -30));
    return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
  });

  const friendsSorted = [...friends.map(f => ({ ...f, isMe: false })).concat({
    coding_time: {
      all_time: 0,
      past_month: sumBy(entriesInRange, entry => entry.duration),
      past_week: 0
    },
    isMe: true,
    username: username ?? "Me"
  })].sort((a, b) => b.coding_time.past_month - a.coding_time.past_month);

  // We have to use useState, so it stays the same when the component is re-rendered
  const [placeholderFriendCode] = useState(generateFriendCode());

  const theme = useMantineTheme();

  return <div>
    <Title order={2} mb={15}>Add a new friend</Title>
    <Group>
      <Formik
        initialValues={{ friendCode: "" }}
        validationSchema={Yup.object().shape({
          friendCode: Yup
            .string()
            .required("Friend code is required")
            .matches(
              /^ttfc_[a-zA-Z0-9]{24}$/,
              "Friend code must start with \"ttfc_\", and be followed by 24 alphanumeric characters.")
        })}
        onSubmit={({ friendCode }, { resetForm }) => {
          addFriend(friendCode)
            .then(() => resetForm())
            .catch(handleErrorWithNotification);
        }}>
        {() => <Form style={{ width: "100%" }}>
          <Group align="start">
            <FormikTextInput
              icon={<PersonIcon />}
              name="friendCode"
              label="Friend code"
              placeholder={placeholderFriendCode}
              sx={{ flex: 1 }}
              styles={theme => ({
                invalid: {
                  "::placeholder": {
                    color: theme.fn.rgba(theme.colors.red[5], 0.4)
                  }
                }
              })}
            />
            <Button type="submit" mt={27.5}>Add</Button>
          </Group>
        </Form>}
      </Formik>
    </Group>
    <Title order={2} mt={40}>Your friends</Title>
    <Table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Friend name</th>
          <th>Time coded during last 30 days</th>
          <th />
        </tr>
      </thead>
      <tbody>{friendsSorted.map(({ username, coding_time: { past_month }, isMe }, idx) => (
        <tr key={username} style={{
          backgroundColor: isMe ? (theme.colorScheme === "dark" ? "#2b2b2b" : "#dedede") : undefined
        }}>
          <td>{idx + 1}</td>
          <td>{username}</td>
          <td>{prettyDuration(past_month)}</td>
          <td>
            {!isMe && <Group position="right">
              <Button
                variant="outline"
                color="red"
                compact
                onClick={() => {
                  unFriend(username).catch(handleErrorWithNotification);
                }}
              >
                Unfriend
              </Button>
            </Group>}
          </td>
        </tr>
      ))}</tbody>
    </Table>
  </div>;
};
